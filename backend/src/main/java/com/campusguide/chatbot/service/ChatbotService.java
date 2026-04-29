package com.campusguide.chatbot.service;

import com.campusguide.building.entity.BuildingPlace;
import com.campusguide.building.repository.BuildingPlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChatbotService {

    private final BuildingPlaceRepository buildingPlaceRepository;

    public String ask(String message) {

        // 1. 질문에서 불필요한 말 제거
        String keyword = extractKeyword(message);

        if (keyword.isBlank()) {
            return "찾고 싶은 시설명을 입력해주세요.";
        }

        // 2. 시설명으로 DB 검색
        List<BuildingPlace> places =
                buildingPlaceRepository.findByPlaceContainingIgnoreCase(keyword);

        // 3. 못 찾은 경우
        if (places.isEmpty()) {
            return "'" + keyword + "' 위치를 찾을 수 없습니다.";
        }

        // 4. 첫 번째 결과 사용
        BuildingPlace place = places.get(0);

        // 5. 답변 생성
        return place.getPlace() + "은(는) "
                + place.getBuilding().getName()
                + " "
                + place.getFloor()
                + "층에 있습니다.";
    }

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
                .replace("?", "")
                .trim();
    }
}