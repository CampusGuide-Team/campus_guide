package com.campusguide.user.dto;

public record UpdateUserRequest(
        String studentId,
        String phone,
        String department
) {}