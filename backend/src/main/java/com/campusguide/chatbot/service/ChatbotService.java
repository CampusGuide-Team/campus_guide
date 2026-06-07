package com.campusguide.chatbot.service;

import com.campusguide.building.entity.BuildingPlace;
import com.campusguide.building.repository.BuildingPlaceRepository;
import com.campusguide.chatbot.dto.ChatResponse;
import com.campusguide.meal.entity.Meal;
import com.campusguide.meal.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.time.temporal.TemporalAdjusters;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatbotService {

    private final BuildingPlaceRepository buildingPlaceRepository;
    private final MealRepository mealRepository;

    @Value("${openai.api.key}")
    private String apiKey;

    public ChatResponse ask(String message) {



        // 카테고리/종류별 시설 조회
        // 카테고리/종류별 시설 조회
// 단, "어디야/어디있어/위치" 질문은 단일 위치 검색으로 보내야 함
        if (!message.contains("어디")
                && !message.contains("위치")
                && !message.contains("어딨어")
                && !message.contains("어디있어")
                && (message.contains("식당")
                || message.contains("카페")
                || message.contains("학과")
                || message.contains("편의시설")
                || message.contains("행정시설")
                || message.contains("체육시설")
                || message.contains("문화시설")
                || message.contains("학습시설")
                || message.contains("기숙사"))) {

            String categoryKeyword = extractCategoryKeyword(message);

            List<BuildingPlace> categoryPlaces =
                    buildingPlaceRepository.findByCategory(categoryKeyword);

            if (categoryPlaces.isEmpty()) {
                categoryPlaces =
                        buildingPlaceRepository.findByTagsContainingIgnoreCase(categoryKeyword);
            }

            if (!categoryPlaces.isEmpty()) {

                StringBuilder builder = new StringBuilder();

                builder.append(categoryKeyword)
                        .append(" 관련 장소는 다음과 같습니다.\n\n");

                for (BuildingPlace p : categoryPlaces) {

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
        }

        // 건물 내부 시설 조회 질문 처리
        if (message.contains("뭐 있어")
                || message.contains("시설")
                || message.contains("안에")
                || message.contains("뭐있어")) {

            String buildingKeyword = extractKeyword(message);

            List<BuildingPlace> buildingPlaces =
                    buildingPlaceRepository.findByBuilding_NameContainingIgnoreCase(buildingKeyword);

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
        List<BuildingPlace> places = new ArrayList<>();

        // 1순위: 시설명 완전 일치
        List<BuildingPlace> exactPlaces =
                buildingPlaceRepository.findByPlaceIgnoreCase(keyword);

        if (!exactPlaces.isEmpty()) {

            places = exactPlaces;

        } else {

            // 시설명 부분 검색
            places = buildingPlaceRepository
                    .findByPlaceContainingIgnoreCase(keyword);
        }

        // 2순위: 태그 검색
        if (places.isEmpty()) {

            List<BuildingPlace> tagResults =
                    buildingPlaceRepository.findByTagsContainingIgnoreCase(keyword);

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
                        if (keyword.length() >= 2
                                && trimmed.contains(keyword)) {

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
        // 5순위 : 식단 질문 처리
        if (message.contains("식단") || message.contains("학식") ||
                message.contains("메뉴") || message.contains("밥") ||
                message.contains("점심")) {

            LocalDate targetDate = parseDateFromMessage(message);
            Optional<Meal> meal = mealRepository.findByMealDate(targetDate);

            if (meal.isPresent()) {
                Meal m = meal.get();
                String topFood = m.getTopFood();

                if (topFood == null || topFood.isBlank() || !topFood.contains("까스")) {
                    return new ChatResponse(targetDate + " 식단 정보가 없습니다.", null, null, null, null, null, null, null);
                }

                StringBuilder sb = new StringBuilder();
                sb.append(targetDate).append(" 학생식당 메뉴입니다.\n\n");
                sb.append("🍱 메뉴\n").append(topFood.replace("\r\n", "\n"));
                return new ChatResponse(sb.toString(), null, null, null, null, null, null, null);
            } else {
                return new ChatResponse(targetDate + " 식단 정보가 없습니다.", null, null, null, null, null, null, null);
            }
        }


        // 검색 실패 시 GPT에게 DB 시설 목록 기반으로 한 번 더 추론 요청
        if (places.isEmpty()) {

            String gptMatchedPlace = findBestPlaceByGPT(message);

            if (gptMatchedPlace != null && !gptMatchedPlace.isBlank()) {
                places = buildingPlaceRepository.findByPlaceIgnoreCase(gptMatchedPlace);
            }

            if (places.isEmpty()) {
                return new ChatResponse(
                        "'" + keyword + "' 에 대한 위치를 찾지 못했어요. 다른 이름이나 줄임말로 입력해보세요!",
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

        // 결과 여러 개
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

        // 단일 결과
        BuildingPlace place = places.get(0);

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

    // GPT 키워드 추출
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
                            "설명하지 말고 검색어만 출력해."
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

    // GPT 실패 시 답변 할 것들 키워드 추출
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
                .replace("에는", "")
                .replace("에", "")
                .replace("는", "")
                .replace("?", "")
                .replace("어디있어", "")
                .trim();
    }
    // 날짜 파싱
    private LocalDate parseDateFromMessage(String message) {
        LocalDate today = LocalDate.now();
    
        // 1. 상대 날짜 키워드 처리
        if (message.contains("오늘")) return today;
        if (message.contains("내일")) return today.plusDays(1);
        if (message.contains("모레")) return today.plusDays(2);
        if (message.contains("어제")) return today.minusDays(1);
        if (message.contains("그제") || message.contains("그저께")) return today.minusDays(2);
    
        // 2. [추가] "X월 Y일" 또는 "X/Y" 패턴 매칭 (예: 6월 10일, 6/10)
        Pattern monthDayPattern = Pattern.compile("(\\d{1,2})\\s*(월|/)\\s*(\\d{1,2})");
        Matcher monthDayMatcher = monthDayPattern.matcher(message);
        if (monthDayMatcher.find()) {
            int month = Integer.parseInt(monthDayMatcher.group(1));
            int day = Integer.parseInt(monthDayMatcher.group(3));
            return LocalDate.of(today.getYear(), month, day);
        }
    
        // 3. [추가] "X일" 패턴 매칭 (월 없이 일만 말했을 때, 예: 10일 식단 뭐야)
        Pattern dayOnlyPattern = Pattern.compile("(\\d{1,2})\\s*일");
        Matcher dayOnlyMatcher = dayOnlyPattern.matcher(message);
        if (dayOnlyMatcher.find()) {
            int day = Integer.parseInt(dayOnlyMatcher.group(1));
            return LocalDate.of(today.getYear(), today.getMonthValue(), day);
        }
    
        // 4. [개선] 요일 처리 (TemporalAdjusters.nextOrSame 사용)
        if (message.contains("월요일")) return today.with(TemporalAdjusters.nextOrSame(DayOfWeek.MONDAY));
        if (message.contains("화요일")) return today.with(TemporalAdjusters.nextOrSame(DayOfWeek.TUESDAY));
        if (message.contains("수요일")) return today.with(TemporalAdjusters.nextOrSame(DayOfWeek.WEDNESDAY));
        if (message.contains("목요일")) return today.with(TemporalAdjusters.nextOrSame(DayOfWeek.THURSDAY));
        if (message.contains("금요일")) return today.with(TemporalAdjusters.nextOrSame(DayOfWeek.FRIDAY));
    
        return today;
    }

    // 카테고리 키워드 추출
    private String extractCategoryKeyword(String message) {

        if (message == null || message.isBlank()) {
            return "";
        }

        if (message.contains("식당")
                || message.contains("학식")
                || message.contains("밥")) {

            return "식당";
        }

        if (message.contains("카페")
                || message.contains("커피")) {

            return "카페";
        }

        if (message.contains("학과")) {

            return "학과";
        }

        if (message.contains("편의시설")) {

            return "편의시설";
        }

        if (message.contains("행정시설")
                || message.contains("행정")) {

            return "행정시설";
        }

        if (message.contains("체육시설")
                || message.contains("운동")) {

            return "체육시설";
        }

        if (message.contains("문화시설")
                || message.contains("공연")) {

            return "문화시설";
        }

        if (message.contains("학습시설")
                || message.contains("공부")
                || message.contains("열람실")) {

            return "학습시설";
        }

        if (message.contains("기숙사")
                || message.contains("생활관")) {

            return "기숙사";
        }

        return extractKeyword(message);
    }

    private String findBestPlaceByGPT(String userMessage) {

        try {
            String url = "https://api.openai.com/v1/chat/completions";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            List<BuildingPlace> allPlaces = buildingPlaceRepository.findAll();

            StringBuilder placeList = new StringBuilder();

            for (BuildingPlace p : allPlaces) {
                placeList.append("- ")
                        .append(p.getPlace())
                        .append(" / 건물: ")
                        .append(p.getBuilding().getName())
                        .append(" / 층: ")
                        .append(p.getFloor())
                        .append(" / 카테고리: ")
                        .append(p.getCategory())
                        .append(" / 태그: ")
                        .append(p.getTags())
                        .append("\n");
            }

            List<Map<String, String>> messages = new ArrayList<>();

            messages.add(Map.of(
                    "role", "system",
                    "content",
                    "너는 캠퍼스 안내 챗봇의 시설명 매칭기야. " +
                            "사용자 질문과 시설 목록을 보고 가장 알맞은 시설명 하나만 골라. " +
                            "반드시 시설 목록에 있는 시설명만 그대로 출력해. " +
                            "없으면 NONE만 출력해. 설명하지 마."
            ));

            messages.add(Map.of(
                    "role", "user",
                    "content",
                    "사용자 질문: " + userMessage + "\n\n시설 목록:\n" + placeList
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

            String content = msg.get("content").toString()
                    .replace("\"", "")
                    .trim();

            if (content.equalsIgnoreCase("NONE")) {
                return "";
            }

            return content;

        } catch (Exception e) {
            return "";
        }
    }

    // 최종 위치 응답
    private String makeLocationAnswer(BuildingPlace place) {

        String placeName = place.getPlace();
        String buildingName = place.getBuilding().getName();
        String floor = place.getFloor();

        return placeName + "은 "
                + buildingName + " "
                + floor + "층에 있어요.";
    }
}
