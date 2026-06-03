package com.campusguide.application.controller;

import com.campusguide.application.dto.ApplicationResponseDto;
import com.campusguide.application.entity.Application;
import com.campusguide.application.service.ApplicationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("applications") // 💡 'application'에서 'applications'로 복수형 수정
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // POST /applications
    @PostMapping
    public ApplicationResponseDto apply(Authentication authentication,
                                        @RequestParam Long clubId) {
        Long userId = (Long) authentication.getPrincipal();
        return ApplicationResponseDto.from(applicationService.apply(userId, clubId));
    }

    // GET /applications
    @GetMapping
    public List<ApplicationResponseDto> getMyApplications(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return applicationService.getMyApplications(userId).stream()
                .map(ApplicationResponseDto::from)
                .toList();
    }

    // 💡 복수형 주소 변경에 맞추어 내부 하위 경로 정비 (GET /applications/club/{clubId})
    @GetMapping("/club/{clubId}")
    public List<ApplicationResponseDto> getClubApplications(@PathVariable Long clubId) {
        return applicationService.getClubApplications(clubId).stream()
                .map(ApplicationResponseDto::from)
                .toList();
    }

    // PATCH /applications/{id}/accept
    @PatchMapping("/{id}/accept")
    public ApplicationResponseDto accept(@PathVariable Long id) {
        return ApplicationResponseDto.from(applicationService.accept(id));
    }

    @PatchMapping("/{id}/reject")
    public ApplicationResponseDto reject(@PathVariable Long id) {
        return ApplicationResponseDto.from(applicationService.reject(id));
    }


}