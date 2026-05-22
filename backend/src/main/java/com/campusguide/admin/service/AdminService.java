package com.campusguide.admin.service;

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
        return clubRepository.save(club);
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

        ClubMember clubMember = new ClubMember();
        clubMember.setClub(club);
        clubMember.setUser(user);
        clubMember.setRole(ClubRole.LEADER);

        return clubMemberRepository.save(clubMember);
    }
}