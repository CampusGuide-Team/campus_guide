package com.campusguide.chatbot.service;

import com.campusguide.building.entity.BuildingPlace;
import com.campusguide.building.repository.BuildingPlaceRepository;
import com.campusguide.chatbot.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatbotService {

    private final BuildingPlaceRepository buildingPlaceRepository;

    @Value("${openai.api.key}")
    private String apiKey;

    public ChatResponse ask(String message) {

        // 건물 내부 시설 조회 질문 처리
        if (message.contains("뭐 있어")
                || message.contains("시설")
                || message.contains("안에")
                || message.contains("뭐있어")) {

            String buildingKeyword = extractKeyword(message);

            List<BuildingPlace> buildingPlaces =
                    buildingPlaceRepository.findByBuilding_Name(buildingKeyword);

            if (!buildingPlaces.isEmpty()) {

                StringBuilder builder = new StringBuilder();

                builder.append(buildingKeyword)
                        .append("에는 다음 시설들이 있습니다.\n\n");

                for (BuildingPlace p : buildingPlaces) {

                    builder.append("- ")
                            .append(p.getPlace())
                            .append(" (")
                            .append(p.getFloor())
                            .append("층)\n");
                }

                return new ChatResponse(
                        builder.toString(),
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                );
            }
        }

        // 1. GPT로 질문에서 핵심 검색어 추출
        String keyword = extractKeywordByGPT(message);

        // GPT 실패 대비
        if (keyword == null || keyword.isBlank()) {
            keyword = extractKeyword(message);
        }

        if (keyword.isBlank()) {
            return new ChatResponse(
                    "찾고 싶은 시설명을 입력해주세요.",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        // 2. DB 검색 우선순위
        //1. 시설명(place)
        //2. 태그(tags)
        //3. 건물명(building name)
        //4. 카테고리(category)
        List<BuildingPlace> places = new ArrayList<>();

// 1순위: 시설명 완전 포함
        List<BuildingPlace> exactPlaces =
                buildingPlaceRepository.findByPlaceIgnoreCase(keyword);

        if (!exactPlaces.isEmpty()) {
            places = exactPlaces;
        } else {

            places = buildingPlaceRepository
                    .findByPlaceContainingIgnoreCase(keyword);
        }
// 2순위: 태그 검색
        if (places.isEmpty()) {

            List<BuildingPlace> tagResults =
                    buildingPlaceRepository.findByTagsContainingIgnoreCase(keyword);

            // 태그 길이 필터
            for (BuildingPlace p : tagResults) {

                if (p.getTags() != null) {

                    String[] splitTags = p.getTags().split(",");

                    for (String tag : splitTags) {

                        String trimmed = tag.trim();

                        // 완전 일치 우선
                        if (trimmed.equalsIgnoreCase(keyword)) {
                            places.add(p);
                            break;
                        }

                        // 2글자 이상일 때만 포함 검색 허용
                        if (keyword.length() >= 2 &&
                                trimmed.contains(keyword)) {

                            places.add(p);
                            break;
                        }
                    }
                }
            }
        }

// 3순위: 건물명 검색
        if (places.isEmpty()) {
            places = buildingPlaceRepository
                    .findByBuilding_NameContainingIgnoreCase(keyword);
        }

// 4순위: 카테고리 검색
        if (places.isEmpty()) {
            places = buildingPlaceRepository
                    .findByCategory(keyword);
        }

        // 3. 못 찾은 경우
        if (places.isEmpty()) {
            return new ChatResponse(
                    "'" + keyword + "' 에 대한 위치를 찾지 못했어요. 다른 이름이나 줄임 및 명칭으로 입력해보세요!!",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }

        if (places.size() > 1) {

            StringBuilder builder = new StringBuilder();

            builder.append("'")
                    .append(keyword)
                    .append("' 관련 결과가 여러 개 있습니다.\n\n");

            for (BuildingPlace p : places) {

                builder.append("- ")
                        .append(p.getPlace())
                        .append(" → ")
                        .append(p.getBuilding().getName())
                        .append(" ")
                        .append(p.getFloor())
                        .append("층\n");
            }

            return new ChatResponse(
                    builder.toString(),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
            );
        }


        // 4. 첫 번째 결과 사용
        BuildingPlace place = places.get(0);

        // 5. DB 결과 기반 답변
        String answer = makeLocationAnswer(place);

        return new ChatResponse(
                answer,
                place.getPlace(),
                place.getBuilding().getName(),
                place.getFloor(),
                place.getBuilding().getLatitude(),
                place.getBuilding().getLongitude(),
                place.getCategory(),
                place.getTags()
        );
    }

    // GPT로 검색 키워드만 추출
    private String extractKeywordByGPT(String message) {
        try {
            String url = "https://api.openai.com/v1/chat/completions";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            List<Map<String, String>> messages = new ArrayList<>();

            messages.add(Map.of(
                    "role", "system",
                    "content",
                    "너는 캠퍼스 안내 챗봇의 검색어 추출기야. " +
                            "사용자 질문에서 건물명 또는 시설명만 하나 추출해. " +
                            "설명하지 말고 검색어만 출력해. " +
                            "예: '학생식당 어디야?' -> '학생식당', '헬스장 위치 알려줘' -> '헬스장'"
            ));

            messages.add(Map.of(
                    "role", "user",
                    "content", message
            ));

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-4o-mini");
            body.put("messages", messages);
            body.put("temperature", 0);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, entity, Map.class);

            Map result = response.getBody();

            if (result == null) {
                return "";
            }

            List choices = (List) result.get("choices");

            if (choices == null || choices.isEmpty()) {
                return "";
            }

            Map first = (Map) choices.get(0);
            Map msg = (Map) first.get("message");

            if (msg == null || msg.get("content") == null) {
                return "";
            }

            return msg.get("content").toString()
                    .replace("\"", "")
                    .trim();

        } catch (Exception e) {
            return "";
        }
    }

    // GPT 실패 시 기존 방식으로 처리
    private String extractKeyword(String message) {
        if (message == null) {
            return "";
        }

        return message.trim()
                .replace("어디야", "")
                .replace("어딨어", "")
                .replace("어디", "")
                .replace("위치", "")
                .replace("알려줘", "")
                .replace("있어", "")
                .replace("있나요", "")
                .replace("뭐 있어", "")
                .replace("뭐있어", "")
                .replace("시설", "")
                .replace("안에", "")
                .replace("에", "")
                .replace("?", "")
                .replace("에는", "")
                .replace("는", "")
                .replace("어디있어", "")
                .replace("과", "") //테스트용 추가
                .trim();
    }

    // 여기 추가

    private String makeLocationAnswer(BuildingPlace place) {

        String placeName = place.getPlace();
        String buildingName = place.getBuilding().getName();
        String floor = place.getFloor();

        return placeName + "은 "
                + buildingName + " "
                + floor + "층에 있어요.";
    }
}