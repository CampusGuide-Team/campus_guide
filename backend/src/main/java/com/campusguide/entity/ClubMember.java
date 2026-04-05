package com.campusguide.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.campusguide.enums.*;

@Entity
@Table(name = "club_members",
        uniqueConstraints = @UniqueConstraint(columnNames = {"club_id", "user_id"}))
public class ClubMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private ClubRole role;

    private LocalDateTime joinedAt;
}
