package com.campusguide.building.dto;

import com.campusguide.building.entity.BuildingPlace;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BuildingPlaceResponse {

    private Long id;
    private String place;
    private String buildingName;
    private String floor;
    private Double latitude;
    private Double longitude;
    private String category;
    private String tags;

    public static BuildingPlaceResponse from(BuildingPlace place) {
        return new BuildingPlaceResponse(
                place.getId(),
                place.getPlace(),
                place.getBuilding().getName(),
                place.getFloor(),
                place.getBuilding().getLatitude(),
                place.getBuilding().getLongitude(),
                place.getCategory(),
                place.getTags()
        );
    }
}