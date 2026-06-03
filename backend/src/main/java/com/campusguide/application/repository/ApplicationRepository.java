package com.campusguide.application.repository;

import com.campusguide.application.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application,Long> {
    List<Application> findByUserId(Long id);
    List<Application> findByClubId(Long clubId);
    Optional<Application> findByUserIdAndClubId(Long userId, Long clubId);
}
