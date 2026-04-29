package com.campusguide.building.repository;

import com.campusguide.building.entity.BuildingPlace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingPlaceRepository extends JpaRepository<BuildingPlace, Long> {

    /*
     * 시설명으로 부분 검색하는 메서드
     *
     * 예)
     * keyword = "학생식당"
     * → place 컬럼에 "학생식당"이 포함된 데이터 검색
     *
     * Containing:
     * → SQL의 LIKE '%keyword%' 와 비슷한 역할
     *
     * IgnoreCase:
     * → 영어 대소문자를 무시하고 검색
     * 예: "caffee", "Caffee", "CAFFEE" 모두 검색 가능
     *
     * 챗봇에서 사용자가 시설명을 정확히 입력하지 않아도
     * 어느 정도 검색되게 하기 위해 사용
     */
    List<BuildingPlace> findByPlaceContainingIgnoreCase(String keyword);

    /*
     * 층으로 시설을 검색하는 메서드
     *
     * 예)
     * floor = "1"
     * → 1층 시설 검색
     *
     * 나중에 사용자가
     * "학생회관 1층에 뭐 있어?"
     * 같은 질문을 했을 때 활용 가능
     */
    List<BuildingPlace> findByFloor(String floor);
}