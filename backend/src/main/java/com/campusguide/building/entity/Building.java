package com.campusguide.building.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "buildings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT")
    private Long id;

    // W16 W18 같은 코드
    @Column(length = 20, unique = true)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Double latitude; // 위도

    @Column(nullable = false)
    private Double longitude; // 경도

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category; // 강의동, 기숙사 등 카테고리

    @OneToMany(mappedBy = "building")
    private List<BuildingPlace> places;

    @Column(columnDefinition = "TEXT")
    private String tags; // 태그 추가

}