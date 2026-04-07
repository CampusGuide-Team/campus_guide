package com.campusguide.club.entity;

import com.campusguide.application.entity.Application;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "clubs")
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String thumbnailUrl;

    private LocalDate recruitStart;
    private LocalDate recruitEnd;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    @OneToMany(mappedBy = "club")
    private List<Application> applications;

    @OneToMany(mappedBy = "club")
    private List<ClubMember> clubMembers;


}
