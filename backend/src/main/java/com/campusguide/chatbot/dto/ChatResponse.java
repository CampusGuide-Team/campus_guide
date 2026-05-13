package com.campusguide.chatbot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatResponse {

    // 챗봇이 사용자에게 보여줄 문장
    private String answer;

    // 검색된 시설명
    private String place;

    // 건물명
    private String buildingName;

    // 층
    private String floor;

    // 위도
    private Double latitude;

    // 경도
    private Double longitude;

    // 카테고리
    private String category;

    // 태그
    private String tags;
}