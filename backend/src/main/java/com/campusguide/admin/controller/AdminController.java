package com.campusguide.admin.controller;

import com.campusguide.admin.service.AdminService;
import com.campusguide.club.entity.Club;
import com.campusguide.club.entity.ClubMember;
import com.campusguide.user.entity.User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // POST /admin/clubs - 동아리 생성
    @PostMapping("/clubs")
    public Club createClub(@RequestBody Club club) {
        return adminService.createClub(club);
    }

    // GET /admin/users/search?studentId=202012345 - 학번으로 유저 검색
    @GetMapping("/users/search")
    public User findUser(@RequestParam String studentId) {
        return adminService.findUserByStudentId(studentId);
    }

    // POST /admin/clubs/{clubId}/leader?studentId=202012345 - 동아리장 지정
    @PostMapping("/clubs/{clubId}/leader")
    public ClubMember assignLeader(@PathVariable Long clubId,
                                   @RequestParam String studentId) {
        return adminService.assignLeader(clubId, studentId);
    }
}