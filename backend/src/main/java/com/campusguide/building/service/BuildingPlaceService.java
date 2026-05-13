package com.campusguide.building.service;

import com.campusguide.building.entity.BuildingPlace;
import com.campusguide.building.repository.BuildingPlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuildingPlaceService {

    private final BuildingPlaceRepository buildingPlaceRepository;

    public List<BuildingPlace> searchPlace(String keyword) {
        return buildingPlaceRepository.findByPlaceContainingIgnoreCase(keyword.trim());//공백 제거

    }

    public List<BuildingPlace> getPlacesByCategory(String category) {
        return buildingPlaceRepository.findByCategory(category);
    }

    public List<BuildingPlace> getPlacesByTag(String tag) {
        return buildingPlaceRepository.findByTagsContainingIgnoreCase(tag);
    }
}