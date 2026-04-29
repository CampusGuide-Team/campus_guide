package com.campusguide.building.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "building_places")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BuildingPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 건물인지 (JSON 무한참조 방지) 무한참조하지말고 꺼지지말고 그냥 무시해라
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;

    // 층 정보
    @Column(nullable = false, length = 50)
    private String floor;

    // 시설 이름
    @Column(nullable = false, columnDefinition = "TEXT")
    private String place;
}