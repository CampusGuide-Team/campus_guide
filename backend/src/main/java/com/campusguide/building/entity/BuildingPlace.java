package com.campusguide.building.entity;

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

    // 어떤 건물인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id")
    private Building building;

    private String floor;

    @Column(columnDefinition = "TEXT")
    private String place;
}