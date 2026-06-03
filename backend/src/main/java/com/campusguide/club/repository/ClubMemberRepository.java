package com.campusguide.club.repository;

import com.campusguide.club.entity.ClubMember;
import com.campusguide.club.enums.ClubRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {
    boolean existsByClubIdAndUserId(Long clubId, Long userId);
    boolean existsByUserIdAndRole(Long userId, ClubRole role);

    List<ClubMember> findByUserId(Long userId);
}
