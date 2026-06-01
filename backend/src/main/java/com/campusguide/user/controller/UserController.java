package com.campusguide.user.controller;

import com.campusguide.user.dto.DevLoginRequest;
import com.campusguide.user.dto.DevLoginResponse;
import com.campusguide.user.dto.UpdateUserRequest;
import com.campusguide.user.dto.UserResponseDto;
import com.campusguide.user.entity.User;
import com.campusguide.user.security.JwtProvider;
import com.campusguide.user.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.campusguide.club.enums.ClubRole;
import com.campusguide.club.repository.ClubMemberRepository;


@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtProvider jwtProvider;
    private final ClubMemberRepository clubMemberRepository;

    public UserController(UserService userService,JwtProvider jwtProvider,ClubMemberRepository clubMemberRepository) {
        this.userService = userService;
        this.jwtProvider = jwtProvider;
        this.clubMemberRepository = clubMemberRepository;
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

    @PostMapping("/dev-login")
    public DevLoginResponse devLogin(
            @RequestBody DevLoginRequest request
    ) {

        User user = userService.saveDevUser(
                request.email(),
                request.name()
        );

        String token = jwtProvider.createToken(
                user.getId(),
                "ROLE_" + user.getRole().name()
        );

        return new DevLoginResponse(token);
    }

    @GetMapping("/me/is-president")
    public boolean isPresident(Authentication authentication) {

        Long userId = (Long) authentication.getPrincipal();

        return clubMemberRepository.existsByUserIdAndRole(
                userId,
                ClubRole.LEADER
        );
    }


}

