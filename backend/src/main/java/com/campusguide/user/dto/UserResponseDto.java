package com.campusguide.user.dto;

import com.campusguide.user.entity.User;

public record UserResponseDto(
        Long id,
        String email,
        String name,
        String studentId,
        String phone,
        String department,
        String role
) {
    public static UserResponseDto from(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getStudentId(),
                user.getPhone(),
                user.getDepartment(),
                user.getRole().name()
        );
    }
}