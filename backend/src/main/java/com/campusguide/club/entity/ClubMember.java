package com.campusguide.club.entity;

import com.campusguide.club.enums.ClubRole;
import com.campusguide.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "club_members",
        uniqueConstraints = @UniqueConstraint(columnNames = {"club_id", "user_id"}))
public class ClubMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) //필요할때만 추출
    @JoinColumn(name = "club_id")
    private Club club;

    @ManyToOne(fetch = FetchType.LAZY) //필요할때 만 추출Lazy
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private ClubRole role;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime joinedAt;
}
