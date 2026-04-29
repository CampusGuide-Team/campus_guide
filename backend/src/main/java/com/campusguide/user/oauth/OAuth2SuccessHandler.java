/*
package com.campusguide.user.oauth;

import com.campusguide.user.security.JwtProvider;
import com.campusguide.user.service.UserService;
import jakarta.servlet.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtProvider jwtProvider;
    private final UserService userService;

    public OAuth2SuccessHandler(JwtProvider jwtProvider, UserService userService) {
        this.jwtProvider = jwtProvider;
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        var user = userService.saveOrGet(email, name, providerId);

        String token = jwtProvider.createToken(user.getId());

        try {
            response.sendRedirect("http://localhost:3000/login/success?token=" + token);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

 */