package com.campusguide.building.controller;

import com.campusguide.building.dto.BuildingPlaceResponse;
import com.campusguide.building.service.BuildingPlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/places")
@RequiredArgsConstructor
public class BuildingPlaceController {

    private final BuildingPlaceService buildingPlaceService;

    @GetMapping("/search")
    public List<BuildingPlaceResponse> searchPlace(@RequestParam String keyword) {
        return buildingPlaceService.searchPlace(keyword);
    }

    @GetMapping("/category")
    public List<BuildingPlaceResponse> getPlacesByCategory(@RequestParam String category) {
        return buildingPlaceService.getPlacesByCategory(category);
    }

    @GetMapping("/tag")
    public List<BuildingPlaceResponse> getPlacesByTag(@RequestParam String tag) {
        return buildingPlaceService.getPlacesByTag(tag);
    }
}