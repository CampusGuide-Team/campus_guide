package com.campusguide.club.service;

import com.campusguide.club.entity.Club;
import com.campusguide.club.repository.ClubRepository;

import java.util.List;

public class ClubService {

    private final ClubRepository clubRepository;

    public ClubService(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public List<Club> searchClubs(String keyword) {
        return clubRepository.findByNameContaining(keyword);
    }

    public Club getClub(Long id) {
        return clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다."));
    }

    public Club createClub(Club club) {
        return clubRepository.save(club);
    }
}
