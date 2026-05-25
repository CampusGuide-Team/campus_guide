package com.campusguide.building.service;

import com.campusguide.building.dto.BuildingPlaceResponse;
import com.campusguide.building.entity.BuildingPlace;
import com.campusguide.building.repository.BuildingPlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BuildingPlaceService {

    private final BuildingPlaceRepository buildingPlaceRepository;

    public List<BuildingPlaceResponse> searchPlace(String keyword) {
        return buildingPlaceRepository.findByPlaceContainingIgnoreCase(keyword.trim())
                .stream()
                .map(BuildingPlaceResponse::from)
                .toList();
    }

    public List<BuildingPlaceResponse> getPlacesByCategory(String category) {
        return buildingPlaceRepository.findByCategory(category)
                .stream()
                .map(BuildingPlaceResponse::from)
                .toList();
    }

    public List<BuildingPlaceResponse> getPlacesByTag(String tag) {
        return buildingPlaceRepository.findByTagsContainingIgnoreCase(tag)
                .stream()
                .map(BuildingPlaceResponse::from)
                .toList();
    }

    public List<String> getCategories() {
        return buildingPlaceRepository.findAll()
                .stream()
                .map(BuildingPlace::getCategory)
                .filter(c -> c != null && !c.isBlank())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}