package com.campusguide.meal.repository;

import com.campusguide.meal.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MealRepository extends JpaRepository<Meal, Long> {
    Optional<Meal> findByMealDate(LocalDate date);
    List<Meal> findAllByMealDateBetween(LocalDate start, LocalDate end);
}