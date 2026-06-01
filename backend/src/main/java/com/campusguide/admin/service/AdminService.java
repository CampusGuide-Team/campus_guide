package com.campusguide.admin.service;

import com.campusguide.club.dto.ClubResponseDto;
import com.campusguide.club.entity.Club;
import com.campusguide.club.entity.ClubMember;
import com.campusguide.club.enums.ClubRole;
import com.campusguide.club.repository.ClubMemberRepository;
import com.campusguide.club.repository.ClubRepository;
import com.campusguide.user.entity.User;
import com.campusguide.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final ClubMemberRepository clubMemberRepository;

    public AdminService(ClubRepository clubRepository,
                        UserRepository userRepository,
                        ClubMemberRepository clubMemberRepository) {
        this.clubRepository = clubRepository;
        this.userRepository = userRepository;
        this.clubMemberRepository = clubMemberRepository;
    }

    // 동아리 생성
    public Club createClub(Club club) {

        if (clubRepository.findByName(club.getName()).isPresent()) {
            throw new RuntimeException("이미 존재하는 동아리명입니다.");
        }

        return clubRepository.save(club);
    }

    public void deleteClub(Long id) {

        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다."));

        clubRepository.delete(club);
    }
    // 학번으로 유저 검색
    public User findUserByStudentId(String studentId) {
        return userRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("해당 학번의 유저를 찾을 수 없습니다."));
    }

    // 동아리장 지정
    public ClubMember assignLeader(Long clubId, String studentId) {

        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다."));

        User user = userRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("해당 학번의 유저를 찾을 수 없습니다."));

        // 기존 회장 MEMBER로 변경
        club.getClubMembers().stream()
                .filter(m -> m.getRole() == ClubRole.LEADER)
                .forEach(m -> {
                    m.setRole(ClubRole.MEMBER);
                    clubMemberRepository.save(m);
                });

        ClubMember clubMember = new ClubMember();
        clubMember.setClub(club);
        clubMember.setUser(user);
        clubMember.setRole(ClubRole.LEADER);

        return clubMemberRepository.save(clubMember);
    }

    // 동아리 정보 업데이트
    public ClubResponseDto updateClub(Long id, Club clubData) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다."));
        if (clubData.getName() != null) club.setName(clubData.getName());
        if (clubData.getDescription() != null) club.setDescription(clubData.getDescription());
        if (clubData.getThumbnailUrl() != null) club.setThumbnailUrl(clubData.getThumbnailUrl());
        if (clubData.getCategory() != null) club.setCategory(clubData.getCategory());
        if (clubData.getRecruitStart() != null) club.setRecruitStart(clubData.getRecruitStart());
        if (clubData.getRecruitEnd() != null) club.setRecruitEnd(clubData.getRecruitEnd());
        return ClubResponseDto.from(clubRepository.save(club));
    }
}