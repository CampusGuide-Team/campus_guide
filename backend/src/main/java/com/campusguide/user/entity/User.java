package com.campusguide.user.entity;

import com.campusguide.application.entity.Application;
import com.campusguide.club.entity.ClubMember;
import com.campusguide.enums.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users",
        uniqueConstraints = @UniqueConstraint(columnNames = {"provider", "provider_id"}))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String name;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Column(name = "provider_id")
    private String providerId;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user")
    private List<Application> applications;


    @OneToMany(mappedBy = "user")
    private List<ClubMember> clubMembers;
}
