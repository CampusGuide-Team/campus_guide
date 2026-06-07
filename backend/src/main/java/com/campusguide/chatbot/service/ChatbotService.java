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

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatbotService {

    private final BuildingPlaceRepository buildingPlaceRepository;
    private final MealRepository mealRepository;

    @Value("${openai.api.key}")
    private String apiKey;

    public ChatResponse ask(String message) {

        if (message == null || message.isBlank()) {
            return new ChatResponse(
                    "질문을 입력해주세요.",
                    null, null, null, null, null, null, null
            );
        }

        // 0순위: 식단 질문 처리 (장소 검색 로직에 걸리기 전에 최우선 분기)
        if (isMealQuestion(message)) {
            return answerMealQuestion(message);
        }

        // 1순위: 카테고리/종류별 시설 조회
        if (!isLocationQuestion(message) && isCategoryQuestion(message)) {

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
                        null, null, null, null, null, null, null
                );
            }
        }

        // 2순위: 건물 내부 시설 조회
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
                        null, null, null, null, null, null, null
                );
            }
        }

        // 3순위: GPT로 검색 키워드 추출
        String keyword = extractKeywordByGPT(message);

        if (keyword == null || keyword.isBlank()) {
            keyword = extractKeyword(message);
        }

        // 키워드가 너무 애매하면 일반 GPT 답변
        if (keyword.isBlank()) {
            String gptAnswer = askGeneralQuestionByGPT(message);
            return new ChatResponse(
                    gptAnswer,
                    null, null, null, null, null, null, null
            );
        }

        // 4순위: DB 검색
        List<BuildingPlace> places = new ArrayList<>();

        // 시설명 완전 일치
        List<BuildingPlace> exactPlaces =
                buildingPlaceRepository.findByPlaceIgnoreCase(keyword);

        if (!exactPlaces.isEmpty()) {
            places = exactPlaces;
        } else {
            // 시설명 부분 검색
            places = buildingPlaceRepository.findByPlaceContainingIgnoreCase(keyword);
        }

        // 태그 검색
        if (places.isEmpty()) {

            List<BuildingPlace> tagResults =
                    buildingPlaceRepository.findByTagsContainingIgnoreCase(keyword);

            for (BuildingPlace p : tagResults) {

                if (p.getTags() != null) {

                    String[] splitTags = p.getTags().split(",");

                    for (String tag : splitTags) {

                        String trimmed = tag.trim();

                        if (trimmed.equalsIgnoreCase(keyword)) {
                            places.add(p);
                            break;
                        }

                        if (keyword.length() >= 2 && trimmed.contains(keyword)) {
                            places.add(p);
                            break;
                        }
                    }
                }
            }
        }

        // 건물명 검색
        if (places.isEmpty()) {
            places = buildingPlaceRepository.findByBuilding_NameContainingIgnoreCase(keyword);
        }

        // 카테고리 검색
        if (places.isEmpty()) {
            places = buildingPlaceRepository.findByCategory(keyword);
        }

        // 5순위: GPT에게 DB 시설 목록 기반으로 한 번 더 매칭 요청
        if (places.isEmpty()) {

            String gptMatchedPlace = findBestPlaceByGPT(message);

            if (gptMatchedPlace != null && !gptMatchedPlace.isBlank()) {
                places = buildingPlaceRepository.findByPlaceIgnoreCase(gptMatchedPlace);
            }
        }

        // 6순위: 그래도 DB에서 못 찾으면 GPT가 일반 답변
        if (places.isEmpty()) {

            String gptAnswer = askGeneralQuestionByGPT(message);

            return new ChatResponse(
                    gptAnswer,
                    null, null, null, null, null, null, null
            );
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
                    null, null, null, null, null, null, null
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

    private boolean isMealQuestion(String message) {
        return message.contains("식단")
                || message.contains("학식")
                || message.contains("메뉴")
                || message.contains("밥")
                || message.contains("점심");
    }

    // [복구 완료] 식단 답변 처리 메서드 (돈까스 필수 조건문 추가)
    private ChatResponse answerMealQuestion(String message) {

        LocalDate targetDate = parseDateFromMessage(message);
        Optional<Meal> meal = mealRepository.findByMealDate(targetDate);

        if (meal.isPresent()) {

            Meal m = meal.get();
            String topFood = m.getTopFood();

            // 데이터 정무 판단: 무조건 메뉴에 "까스"가 들어가야 정상 크롤링으로 취급
            if (topFood == null || topFood.isBlank() || !topFood.contains("까스")) {
                return new ChatResponse(
                        targetDate + " 식단 정보가 없습니다.",
                        null, null, null, null, null, null, null
                );
            }

            StringBuilder sb = new StringBuilder();
            sb.append(targetDate).append(" 학생식당 메뉴입니다.\n\n");
            sb.append("🍱 메뉴\n").append(topFood.replace("\r\n", "\n"));

            return new ChatResponse(
                    sb.toString(),
                    null, null, null, null, null, null, null
                );
        }

        return new ChatResponse(
                targetDate + " 식단 정보가 없습니다.",
                null, null, null, null, null, null, null
        );
    }

    private boolean isLocationQuestion(String message) {
        return message.contains("어디")
                || message.contains("위치")
                || message.contains("어딨어")
                || message.contains("어디있어");
    }

    private boolean isCategoryQuestion(String message) {
        return message.contains("식당")
                || message.contains("카페")
                || message.contains("학과")
                || message.contains("편의시설")
                || message.contains("행정시설")
                || message.contains("체육시설")
                || message.contains("문화시설")
                || message.contains("학습시설")
                || message.contains("기숙사");
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
                            "일반 질문이면 NONE만 출력해. " +
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

    // 일반 질문 GPT 답변
    private String askGeneralQuestionByGPT(String userMessage) {

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
                    "너는 국립한국교통대학교 캠퍼스 안내 챗봇 KU Navigator야. " +
                            "건물 위치, 시설, 동아리, 학교생활 관련 질문에 친절하게 답변해. " +
                            "단, 정확한 학교 내부 데이터가 필요한 질문은 '학교 DB에 등록된 정보가 부족할 수 있습니다'라고 안내해. " +
                            "답변은 한국어로 짧고 자연스럽게 해."
            ));

            messages.add(Map.of(
                    "role", "user",
                    "content", userMessage
            ));

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-4o-mini");
            body.put("messages", messages);
            body.put("temperature", 0.4);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, entity, Map.class);

            Map result = response.getBody();

            if (result == null) {
                return "죄송합니다. 현재 답변을 생성할 수 없습니다.";
            }

            List choices = (List) result.get("choices");

            if (choices == null || choices.isEmpty()) {
                return "죄송합니다. 현재 답변을 생성할 수 없습니다.";
            }

            Map first = (Map) choices.get(0);
            Map msg = (Map) first.get("message");

            if (msg == null || msg.get("content") == null) {
                return "죄송합니다. 현재 답변을 생성할 수 없습니다.";
            }

            return msg.get("content").toString().trim();

        } catch (Exception e) {
            return "죄송합니다. 현재 AI 답변을 불러올 수 없습니다.";
        }
    }

    // GPT 실패 시 키워드 추출
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

    // [정규식 날짜 파싱 적용] 6월 4일, 6/8 등의 텍스트를 최우선으로 정확하게 뜯어냄
    private LocalDate parseDateFromMessage(String message) {

        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();

        // 1. "X월 Y일" 또는 "X/Y" 형태 정규식 파싱
        Pattern monthDayPattern = Pattern.compile("(\\d{1,2})\\s*(월|/)\\s*(\\d{1,2})");
        Matcher monthDayMatcher = monthDayPattern.matcher(message);

        if (monthDayMatcher.find()) {
            int month = Integer.parseInt(monthDayMatcher.group(1));
            int day = Integer.parseInt(monthDayMatcher.group(3));
            return LocalDate.of(currentYear, month, day);
        }

        // 2. "X일" 형태로 일만 말했을 때
        Pattern dayOnlyPattern = Pattern.compile("(\\d{1,2})\\s*일");
        Matcher dayOnlyMatcher = dayOnlyPattern.matcher(message);

        if (dayOnlyMatcher.find()) {
            int day = Integer.parseInt(dayOnlyMatcher.group(1));
            return LocalDate.of(currentYear, today.getMonthValue(), day);
        }

        // 3. 상대 날짜 키워드 처리
        if (message.contains("오늘")) return today;
        if (message.contains("내일")) return today.plusDays(1);
        if (message.contains("모레")) return today.plusDays(2);
        if (message.contains("어제")) return today.minusDays(1);
        if (message.contains("그제") || message.contains("그저께")) return today.minusDays(2);

        // 4. 요일 키워드 처리
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

        if (message.contains("식당") || message.contains("학식") || message.contains("밥")) {
            return "식당";
        }

        if (message.contains("카페") || message.contains("커피")) {
            return "카페";
        }

        if (message.contains("학과")) {
            return "학과";
        }

        if (message.contains("편의시설")) {
            return "편의시설";
        }

        if (message.contains("행정시설") || message.contains("행정")) {
            return "행정시설";
        }

        if (message.contains("체육시설") || message.contains("운동")) {
            return "체육시설";
        }

        if (message.contains("문화시설") || message.contains("공연")) {
            return "문화시설";
        }

        if (message.contains("학습시설") || message.contains("공부") || message.contains("열람실")) {
            return "학습시설";
        }

        if (message.contains("기숙사") || message.contains("생활관")) {
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

    private String makeLocationAnswer(BuildingPlace place) {

        String placeName = place.getPlace();
        String buildingName = place.getBuilding().getName();
        String floor = place.getFloor();

        return placeName + "은 "
                + buildingName + " "
                + floor + "층에 있어요.";
    }
}
