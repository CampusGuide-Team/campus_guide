package com.campusguide.application.dto;

import com.campusguide.application.entity.Application;

public record ApplicationResponseDto(
        Long id,
        String status,
        String appliedAt,
        String introduction,
        Long clubId,
        String clubName,
        UserDto user
) {
    public record UserDto(
            Long id,
            String name,
            String email,
            String studentId,
            String phone,
            String department
    ) {}

    public static ApplicationResponseDto from(Application app) {
        return new ApplicationResponseDto(
                app.getId(),
                app.getStatus().name(),
                app.getAppliedAt() != null ? app.getAppliedAt().toString() : null,
                app.getIntroduction(),
                app.getClub().getId(),
                app.getClub().getName(),
                new UserDto(
                        app.getUser().getId(),
                        app.getUser().getName(),
                        app.getUser().getEmail(),
                        app.getUser().getStudentId(),
                        app.getUser().getPhone(),
                        app.getUser().getDepartment()
                )
        );
    }
}