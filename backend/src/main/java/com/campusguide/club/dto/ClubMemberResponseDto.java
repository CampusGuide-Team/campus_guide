package com.campusguide.club.dto;

import java.time.LocalDateTime;

public record ClubMemberResponseDto(
        Long clubMemberId,
        Long userId,
        String name,
        String email,
        String clubRole,
        LocalDateTime joinedAt
) {
}
