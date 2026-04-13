package com.campusguide.building.controller;

import com.campusguide.building.entity.Building;
import com.campusguide.building.service.BuildingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingService buildingService;

    // 건물 전체 조회
    @GetMapping
    public List<Building> getBuildings() {
        return buildingService.getAllBuildings();
    }

    // 건물 검색
    @GetMapping("/search")
    public List<Building> searchBuildings(@RequestParam String name) {
        return buildingService.searchBuilding(name);
    }

    // 건물 상세
    @GetMapping("/{id}")
    public Building getBuilding(@PathVariable Long id) {
        return buildingService.getBuilding(id);
    }
}