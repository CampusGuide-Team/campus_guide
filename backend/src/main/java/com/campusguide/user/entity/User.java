package com.campusguide.user.entity;

import com.campusguide.application.entity.Application;
import com.campusguide.club.entity.ClubMember;
import com.campusguide.user.enums.Provider;
import com.campusguide.user.enums.Role;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@Entity
@Table(name = "users",
        uniqueConstraints = @UniqueConstraint(columnNames = {"provider", "provider_id"}))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true) // 이메일 부분 추가
    private String email;

    //학번 전화번호 학과 추가
    private String studentId;

    private String phone;

    private String department;

    private String name;//이름

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Column(name = "provider_id")
    private String providerId;

    @OneToMany(mappedBy = "user")
    private List<Application> applications;


    @OneToMany(mappedBy = "user")
    private List<ClubMember> clubMembers;

    @CreationTimestamp // 유저레파짓토리를.save(user)를 사용하면 현재시간 알아서 자동으로 들어감
    @Column(updatable = false)
    private LocalDateTime createdAt; // 가입 날짜 자동 생성

    //prePersist() 자동 실행 -> createdAt = 현재시간 - > DB 저장 엔티티 자동처리를 위해서


}
