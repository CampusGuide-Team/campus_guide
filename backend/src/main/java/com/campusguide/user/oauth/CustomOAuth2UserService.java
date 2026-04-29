/*
package com.campusguide.user.oauth;

import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.user.*;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User user = super.loadUser(userRequest);

        String email = user.getAttribute("email");

        // 🔥 핵심: 학교 이메일 제한
        if (email == null || !email.endsWith("@a.ut.ac.kr")) {
            throw new RuntimeException("학교 이메일만 허용됨");
        }

        return user;
    }
}

 */