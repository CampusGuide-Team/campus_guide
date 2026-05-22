package com.campusguide.user.repository;

import com.campusguide.user.enums.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import com.campusguide.user.entity.User;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByProviderAndProviderId(Provider provider, String providerId);
    Optional<User> findByStudentId(String studentId);
}
