package com.campusguide.user.dto;

public record DevLoginRequest(
        String email,
        String name
) {}