package com.campusguide.club.dto;

import com.campusguide.club.entity.Club;
import com.campusguide.club.entity.ClubMember;
import com.campusguide.club.enums.ClubRole;

import java.time.LocalDate;

public record ClubResponseDto(
        Long id,
        String name,
        String description,
        String thumbnailUrl,
        String category,
        int memberCount,
        String leaderStudentId,
        String leaderName,
        LocalDate recruitStart,
        LocalDate recruitEnd
) {
    public static ClubResponseDto from(Club club) {

        ClubMember leader = null;

        if (club.getClubMembers() != null) {
            leader = club.getClubMembers().stream()
                    .filter(m -> m.getRole() == ClubRole.LEADER)
                    .findFirst()
                    .orElse(null);
        }

        return new ClubResponseDto(
                club.getId(),
                club.getName(),
                club.getDescription(),
                club.getThumbnailUrl(),
                club.getCategory() != null ? club.getCategory().name() : null,
                club.getClubMembers() != null ? club.getClubMembers().size() : 0,
                leader != null ? leader.getUser().getStudentId() : null,
                leader != null ? leader.getUser().getName() : null,
                club.getRecruitStart(),
                club.getRecruitEnd()
        );
    }
}