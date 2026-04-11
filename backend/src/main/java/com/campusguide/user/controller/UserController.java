package com.campusguide.user.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping("/me")
    public Long me(Authentication authentication) {
        return (Long) authentication.getPrincipal();
    }
}