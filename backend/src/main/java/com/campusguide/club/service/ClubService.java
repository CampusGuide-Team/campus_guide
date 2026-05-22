package com.campusguide.club.service;

import com.campusguide.club.dto.ClubMemberResponseDto;
import com.campusguide.club.dto.ClubResponseDto;
import com.campusguide.club.entity.Club;
import com.campusguide.club.repository.ClubRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClubService {

    private final ClubRepository clubRepository;

    public ClubService(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    public List<ClubResponseDto> getAllClubs() {
        return clubRepository.findAll().stream()
                .map(ClubResponseDto::from)
                .toList();
    }

    public List<ClubResponseDto> searchClubs(String keyword) {
        return clubRepository.findByNameContaining(keyword).stream()
                .map(ClubResponseDto::from)
                .toList();
    }

    public ClubResponseDto getClub(Long id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다."));
        return ClubResponseDto.from(club);
    }

    public ClubResponseDto createClub(Club club) {
        return ClubResponseDto.from(clubRepository.save(club));
    }
    // Club
    // -------
    // ClubMember get
    public List<ClubMemberResponseDto> getClubMembers(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다."));
        return club.getClubMembers().stream()
                .map(ClubMemberResponseDto::from)
                .toList();
    }
}
