package com.campusguide.club.enums;

public enum ClubCategory {
    ACADEMIC,   // 학술,공부,
    SPORTS,     // 운동
    CULTURE,    // 문화
    IT,         // IT
    VOLUNTEER   // 봉사
}

//한국어 표시용 부분 이건 고민해보기
//public enum ClubCategory {
//
//    ACADEMIC("학술"),
//    SPORTS("스포츠"),
//    CULTURE("문화"),
//    IT("IT"),
//    VOLUNTEER("봉사");
//
//    private final String label;
//
//    ClubCategory(String label) {
//        this.label = label;
//    }
//
//    public String getLabel() {
//        return label;
//    }
//}