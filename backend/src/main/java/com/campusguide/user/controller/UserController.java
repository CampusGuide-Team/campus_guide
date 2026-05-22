package com.campusguide.user.controller;

import com.campusguide.user.dto.UpdateUserRequest;
import com.campusguide.user.dto.UserResponseDto;
import com.campusguide.user.entity.User;
import com.campusguide.user.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public Long me(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }

    @PatchMapping("/me")
    public UserResponseDto updateMe(Authentication authentication, @RequestBody UpdateUserRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        return UserResponseDto.from(userService.updateUser(userId, request));
    }

    @GetMapping("/me/profile")
    public UserResponseDto getProfile(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return UserResponseDto.from(userService.getUser(userId));
    }


}

