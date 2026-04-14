package com.campusguide.building.repository;

import com.campusguide.building.entity.BuildingPlace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingPlaceRepository extends JpaRepository<BuildingPlace, Long> {

    List<BuildingPlace> findByPlaceContaining(String keyword);

}