package com.campusguide.club.controller;

import com.campusguide.club.entity.Club;
import com.campusguide.club.service.ClubService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/club")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    //Get /clubs
    @GetMapping
    public List<Club> getAllclubs() {
        return clubService.getAllClubs();
    }

    //Get /clubs/search
    @GetMapping("/search")
    public List<Club> searchClubs(@RequestParam String keyword) {
        return clubService.searchClubs(keyword);
    }
    //Get /clubs/{id}
    @GetMapping("/{id}")
    public Club getClub(@PathVariable Long id) {
        return clubService.getClub(id);
    }

    @PostMapping
    public Club createClub(@RequestBody Club club) {
        return clubService.createClub(club);
    }
}
