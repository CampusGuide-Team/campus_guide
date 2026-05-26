package com.campusguide.building.repository;

import com.campusguide.building.entity.BuildingPlace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingPlaceRepository extends JpaRepository<BuildingPlace, Long> {

    List<BuildingPlace> findByPlaceContainingIgnoreCase(String keyword);

    List<BuildingPlace> findByFloor(String floor);

    List<BuildingPlace> findByCategory(String category);

    List<BuildingPlace> findByTagsContainingIgnoreCase(String tag);

    List<BuildingPlace> findByBuilding_NameContainingIgnoreCase(String name);

    List<BuildingPlace> findByPlaceIgnoreCase(String place);

    List<BuildingPlace> findByBuilding_Name(String name);
}
