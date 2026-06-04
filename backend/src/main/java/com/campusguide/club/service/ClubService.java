package com.campusguide.club.service;

import com.campusguide.application.repository.ApplicationRepository;
import com.campusguide.club.dto.ClubMemberResponseDto;
import com.campusguide.club.dto.ClubResponseDto;
import com.campusguide.club.entity.Club;
import com.campusguide.club.entity.ClubMember;
import com.campusguide.club.enums.ClubRole;
import com.campusguide.club.repository.ClubMemberRepository;
import com.campusguide.club.repository.ClubRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClubService {

    private final ClubRepository clubRepository;
    private final ClubMemberRepository clubMemberRepository;
    private final ApplicationRepository applicationRepository;

    public ClubService(ClubRepository clubRepository,
                       ClubMemberRepository clubMemberRepository,
                       ApplicationRepository applicationRepository) {
        this.clubRepository = clubRepository;
        this.clubMemberRepository = clubMemberRepository;
        this.applicationRepository = applicationRepository;
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

    public List<ClubMemberResponseDto> getClubMembers(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다."));
        return club.getClubMembers().stream()
                .map(ClubMemberResponseDto::from)
                .toList();
    }

    public List<ClubResponseDto> getMyClubs(Long userId) {
        return clubMemberRepository.findByUserId(userId).stream()
                .filter(m -> m.getRole() == ClubRole.LEADER)
                .map(m -> ClubResponseDto.from(m.getClub()))
                .toList();
    }

    public void removeMember(Long clubId, Long memberId) {
        ClubMember member = clubMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        // Application도 같이 삭제
        applicationRepository.findByUserIdAndClubId(
                        member.getUser().getId(), clubId)
                .ifPresent(applicationRepository::delete);

        clubMemberRepository.delete(member);
    }

    public ClubResponseDto updateClub(Long id, Club clubData, Long userId) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다."));

        // 임원인지 확인
        boolean isLeader = clubMemberRepository.findByUserId(userId).stream()
                .anyMatch(m -> m.getClub().getId().equals(id) && m.getRole() == ClubRole.LEADER);

        if (!isLeader) throw new RuntimeException("권한이 없습니다.");

        if (clubData.getName() != null) club.setName(clubData.getName());
        if (clubData.getDescription() != null) club.setDescription(clubData.getDescription());
        if (clubData.getThumbnailUrl() != null) club.setThumbnailUrl(clubData.getThumbnailUrl());
        if (clubData.getRecruitStart() != null) club.setRecruitStart(clubData.getRecruitStart());
        if (clubData.getRecruitEnd() != null) club.setRecruitEnd(clubData.getRecruitEnd());

        return ClubResponseDto.from(clubRepository.save(club));
    }
}