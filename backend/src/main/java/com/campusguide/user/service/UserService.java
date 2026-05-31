package com.campusguide.user.service;

import com.campusguide.user.dto.UpdateUserRequest;
import com.campusguide.user.entity.User;
import com.campusguide.user.enums.*;
import com.campusguide.user.repository.UserRepository;
import org.springframework.stereotype.Service;



@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User saveOrGet(String email, String name, String providerId, Provider provider) {
        return userRepository
                .findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> {
                    User user = new User();
                    user.setEmail(email);
                    user.setName(name);
                    user.setProvider(Provider.GOOGLE);
                    user.setProviderId(providerId);
                    user.setRole(Role.USER);
                    return userRepository.save(user);
                });
    }
    public User updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        user.setStudentId(request.studentId());
        user.setPhone(request.phone());
        user.setDepartment(request.department());
        return userRepository.save(user);
    }

    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
    }

    //임의의 데이터 만들 때 필요
    public User saveDevUser(String email, String name) {

        return userRepository.findByEmail(email)
                .orElseGet(() -> {

                    User user = new User();

                    user.setEmail(email);
                    user.setName(name);

                    user.setRole(Role.USER);

                    return userRepository.save(user);
                });
    }
}