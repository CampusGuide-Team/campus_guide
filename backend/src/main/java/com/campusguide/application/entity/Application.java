package com.campusguide.application.entity;

import com.campusguide.application.enums.ApplicationStatus;
import com.campusguide.club.entity.Club;
import com.campusguide.user.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "club_id"}))
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "club_id")
    private Club club;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private LocalDateTime appliedAt;
}

