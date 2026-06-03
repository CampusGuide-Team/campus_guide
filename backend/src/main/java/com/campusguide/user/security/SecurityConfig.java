package com.campusguide.user.security;

import com.campusguide.user.oauth.CustomOAuth2UserService;
import com.campusguide.user.oauth.OAuth2SuccessHandler;
import org.springframework.context.annotation.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final CustomOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler successHandler;
    private final JwtProvider jwtProvider;

    public SecurityConfig(CustomOAuth2UserService oAuth2UserService,
                          OAuth2SuccessHandler successHandler,
                          JwtProvider jwtProvider) {
        this.oAuth2UserService = oAuth2UserService;
        this.successHandler = successHandler;
        this.jwtProvider = jwtProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/oauth2/**",
                                "/login/**",
                                "/chat/**",
                                "/places/**",
                                "/buildings/**",
                                "/users/dev-login", // 개발자 로그인
                                "/clubs",// 동아리
                                "/clubs/**",
                                "/applications/**"
                        ).permitAll()
                        .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(oAuth2UserService)
                        )
                        .successHandler(successHandler)
                )
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtProvider),
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}