package com.campusguide.club.dto;

import com.campusguide.club.entity.Club;
import java.time.LocalDate;

public record ClubResponseDto(
        Long id,
        String name,
        String description,
        String thumbnailUrl,
        String category,
        int memberCount,
        LocalDate recruitStart,
        LocalDate recruitEnd
) {
    public static ClubResponseDto from(Club club) {
        return new ClubResponseDto(
                club.getId(),
                club.getName(),
                club.getDescription(),
                club.getThumbnailUrl(),
                club.getCategory() != null ? club.getCategory().name() : null,
                club.getClubMembers() != null ? club.getClubMembers().size() : 0,
                club.getRecruitStart(),
                club.getRecruitEnd()
        );
    }
}