package com.campusguide.application.controller;


import com.campusguide.application.entity.Application;
import com.campusguide.application.service.ApplicationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("application")
public class ApplicationController {

    private final ApplicationService applicationService;


    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    //POST /applications
    @PostMapping
    public Application apply(Authentication authentication,
                             @RequestParam Long clubId){
        Long userId = (Long)authentication.getPrincipal();
        return applicationService.apply(userId,clubId);
    }

    // GET /applications
    @GetMapping
    public List<Application> getMyApplications(Authentication authentication){
        Long userId = (Long)authentication.getPrincipal();
        return applicationService.getMyApplications(userId);
    }

    //PATCH /applications/{id}/accept
    @PatchMapping("/{id}/accept")
    public Application accept(@PathVariable Long id){
        return applicationService.accept(id);
    }

    @PatchMapping("/{id}/accept")
    public Application reject(@PathVariable Long id){
        return applicationService.reject(id);
    }
}
