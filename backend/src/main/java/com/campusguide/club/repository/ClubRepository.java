package com.campusguide.club.repository;

import com.campusguide.club.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import java.util.List;

public interface ClubRepository extends JpaRepository<Club, Long> {
    List<Club> findByNameContaining(String keyword);
    Optional<Club> findByName(String name);
}
