package com.campusguide.club.entity;

import com.campusguide.application.entity.Application;
import com.campusguide.club.enums.ClubCategory;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

    @CreationTimestamp //자동으로 추가해주기
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp //자동으로 변경사항 업데이트
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "club")
    private List<Application> applications;

    @OneToMany(mappedBy = "club")
    private List<ClubMember> clubMembers;

    @Enumerated(EnumType.STRING) //햇갈림 방지 enum 추가해서 카테고리 추가
    private ClubCategory category;

}
