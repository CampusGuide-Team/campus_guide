package com.campusguide.application.service;

import com.campusguide.application.entity.Application;
import com.campusguide.application.enums.ApplicationStatus;
import com.campusguide.application.repository.ApplicationRepository;
import com.campusguide.club.entity.Club;
import com.campusguide.club.repository.ClubRepository;
import com.campusguide.user.entity.User;
import com.campusguide.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ClubRepository clubRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              UserRepository userRepository,
                              ClubRepository clubRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.clubRepository = clubRepository;
    }

    public Application apply(Long userId, Long clubId) {
        User user = (User) userRepository.findById(userId).orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Club club = clubRepository.findById(clubId).orElseThrow(()-> new RuntimeException("동아리를 찾을 수 없습니다."));

        Application application = new Application();
        application.setUser(user);
        application.setClub(club);
        application.setStatus(ApplicationStatus.SUBMITTED);
        application.setAppliedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    public List<Application> getMyApplications(Long userId){
        return applicationRepository.findByUserId(userId);
    }

    public Application accept(Long applicationId){
        Application application = applicationRepository.findById(applicationId).orElseThrow(()->new RuntimeException("신청을 찾을 수 없습니다."));
        application.setStatus(ApplicationStatus.ACCEPTED);
        return applicationRepository.save(application);
    }

    public Application reject(Long applicationId){
        Application application = applicationRepository.findById(applicationId).orElseThrow(()->new RuntimeException("신청을 찾을 수 없습니다."));
        application.setStatus(ApplicationStatus.REJECTED);
        return applicationRepository.save(application);
    }

    public List<Application> getClubApplications(Long clubId) {
        return applicationRepository.findByClubId(clubId);
    }

    public Application apply(Long userId, Long clubId, String introduction) { // 💡 파라미터 추가
        User user = (User) userRepository.findById(userId).orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다.")); //
        Club club = clubRepository.findById(clubId).orElseThrow(() -> new RuntimeException("동아리를 찾을 수 없습니다.")); //

        Application application = new Application(); //
        application.setUser(user); //
        application.setClub(club); //
        application.setIntroduction(introduction); // 💡 엔티티에 자기소개 세팅!
        application.setStatus(ApplicationStatus.SUBMITTED); //
        application.setAppliedAt(LocalDateTime.now()); //

        return applicationRepository.save(application); //
    }
}
