package com.campusguide.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campusguide.user.entity.User;


public interface UserRepository extends JpaRepository<User, Long> {
}
