package com.campusguide.building.service;

import com.campusguide.building.entity.Building;
import com.campusguide.building.repository.BuildingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuildingService {

    private final BuildingRepository buildingRepository;

    // 모든 건물 조회
    public List<Building> getAllBuildings() {
        return buildingRepository.findAll();
    }

    // 건물 검색
    public List<Building> searchBuilding(String name) {
        return buildingRepository.findByNameContaining(name);
    }

    // 건물 상세 조회
    public Building getBuilding(Long id) {
        return buildingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("건물을 찾을 수 없습니다."));
    }
}