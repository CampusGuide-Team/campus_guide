package com.campusguide.club.controller;

import com.campusguide.club.dto.ClubMemberResponseDto;
import com.campusguide.club.dto.ClubResponseDto;
import com.campusguide.club.entity.Club;
import com.campusguide.club.service.ClubService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clubs")
@CrossOrigin(origins = "*")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    // GET /clubs
    @GetMapping
    public List<ClubResponseDto> getAllClubs() {
        return clubService.getAllClubs();
    }

    // GET /clubs/search?keyword=개발
    @GetMapping("/search")
    public List<ClubResponseDto> searchClubs(@RequestParam String keyword) {
        return clubService.searchClubs(keyword);
    }

    // GET /clubs/{id}
    @GetMapping("/{id}")
    public ClubResponseDto getClub(@PathVariable Long id) {
        return clubService.getClub(id);
    }

    // GET /clubs/{id}/members
    @GetMapping("/{id}/members")
    public List<ClubMemberResponseDto> getClubMembers(@PathVariable Long id) {
        return clubService.getClubMembers(id);
    }

    // POST /clubs
    @PostMapping
    public ClubResponseDto createClub(@RequestBody Club club) {
        return clubService.createClub(club);
    }

    @GetMapping("/my")
    public List<ClubResponseDto> getMyClubs(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return clubService.getMyClubs(userId);
    }

    @DeleteMapping("/{clubId}/members/{memberId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long clubId, @PathVariable Long memberId) {
        clubService.removeMember(clubId, memberId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}")
    public ClubResponseDto updateClub(@PathVariable Long id,
                                      @RequestBody Club club,
                                      Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return clubService.updateClub(id, club, userId);
    }
}