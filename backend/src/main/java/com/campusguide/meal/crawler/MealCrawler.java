package com.campusguide.meal.crawler;

import com.campusguide.meal.entity.Meal;
import com.campusguide.meal.repository.MealRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class MealCrawler implements CommandLineRunner {

    private final MealRepository mealRepository;

    @Override
    public void run(String... args) throws Exception {
        fetchAndSave();
    }

    // 매주 월요일 오전 7시 자동 실행
    @Scheduled(cron = "0 0 7 * * MON")
    public void crawlWeeklyMeals() {
        fetchAndSave();
    }

    public void fetchAndSave() {
        try {
            String url = "https://www.ut.ac.kr/prog/mealManage/MT01/kor/sub06_02_02_01/dayList.do";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-Requested-With", "XMLHttpRequest");
            headers.set("Referer", "https://www.ut.ac.kr/prog/mealManage/MT01/kor/sub06_02_02_01/list.do");
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<List> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, List.class
            );

            List<Map<String, Object>> meals = response.getBody();

            if (meals == null || meals.isEmpty()) {
                log.warn("식단 데이터 없음");
                return;
            }

            // 기존 이번주 데이터 삭제
            LocalDate monday = LocalDate.now().with(java.time.DayOfWeek.MONDAY);
            LocalDate sunday = monday.plusDays(6);
            mealRepository.deleteAll(mealRepository.findAllByMealDateBetween(monday, sunday));

            // 새 데이터 저장
            for (Map<String, Object> m : meals) {
                String dateStr = (String) m.get("mealDate");
                String topFood = (String) m.get("topFood");


                LocalDate date = LocalDate.parse(dateStr);

                if (!mealRepository.findAllByMealDate(date).isEmpty()) {
                    continue;
                }

                Meal meal = Meal.builder()
                        .mealDate(date)
                        .topFood(topFood)
                        .build();

                mealRepository.save(meal);
            }

            log.info("식단 크롤링 완료: {}개", meals.size());

        } catch (Exception e) {
            log.error("식단 크롤링 실패", e);
        }
    }
}
