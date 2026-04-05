package com.campusguide.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campusguide.entity.User;


public interface UserRepository extends JpaRepository<User, Long> {
}
