package com.campusguide.building.repository;

import com.campusguide.building.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface BuildingRepository extends JpaRepository<Building, Long> {

    Optional<Building> findByName(String name);

    List<Building> findByNameContaining(String keyword);

    // 대소문자 무시
    List<Building> findByNameContainingIgnoreCase(String keyword);

    Optional<Building> findByCode(String code);


}