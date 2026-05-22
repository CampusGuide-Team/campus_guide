package com.campusguide.club.dto;

import com.campusguide.club.entity.ClubMember;
import java.time.LocalDateTime;

public record ClubMemberResponseDto(
        Long clubMemberId,
        Long userId,
        String name,
        String email,
        String clubRole,
        LocalDateTime joinedAt
) {
    public static ClubMemberResponseDto from(ClubMember clubMember) {
        return new ClubMemberResponseDto(
                clubMember.getId(),
                clubMember.getUser().getId(),
                clubMember.getUser().getName(),
                clubMember.getUser().getEmail(),
                clubMember.getRole() != null ? clubMember.getRole().name() : null,
                clubMember.getJoinedAt()
        );
    }
}