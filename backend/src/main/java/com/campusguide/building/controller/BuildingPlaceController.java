package com.campusguide.building.controller;

import com.campusguide.building.entity.BuildingPlace;
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
    public List<BuildingPlace> searchPlace(@RequestParam String keyword) {
        return buildingPlaceService.searchPlace(keyword);
    }

    @GetMapping("/category")
    public List<BuildingPlace> getPlacesByCategory(@RequestParam String category) {
        return buildingPlaceService.getPlacesByCategory(category);
    }

    @GetMapping("/tag")
    public List<BuildingPlace> getPlacesByTag(@RequestParam String tag) {
        return buildingPlaceService.getPlacesByTag(tag);
    }
}