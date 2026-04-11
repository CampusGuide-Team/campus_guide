package com.campusguide.user.service;

import com.campusguide.user.entity.User;
import com.campusguide.user.enums.*;
import com.campusguide.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveOrGet(String email, String name, String providerId) {
        return userRepository
                .findByProviderAndProviderId(Provider.GOOGLE, providerId)
                .orElseGet(() -> {
                    User user = new User();
                    user.setEmail(email);
                    user.setName(name);
                    user.setProvider(Provider.GOOGLE);
                    user.setProviderId(providerId);
                    user.setRole(Role.USER);
                    user.setCreatedAt(LocalDateTime.now());
                    return userRepository.save(user);
                });
    }
}