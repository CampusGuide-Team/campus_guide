package com.campusguide.building.loader;

import com.campusguide.building.entity.Building;
import com.campusguide.building.entity.BuildingPlace;
import com.campusguide.building.repository.BuildingPlaceRepository;
import com.campusguide.building.repository.BuildingRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class BuildingPlaceCsvLoader implements CommandLineRunner {

    private final BuildingRepository buildingRepository;
    private final BuildingPlaceRepository buildingPlaceRepository;

    @Override
    public void run(String... args) throws Exception {

        // 이미 시설 데이터가 있으면 CSV를 다시 읽지 않음
        if (buildingPlaceRepository.count() > 0) {
            return;
        }

        // src/main/resources/data/building_info.csv 파일 읽기
        ClassPathResource resource = new ClassPathResource("data/building_info.csv");

        try (
                Reader reader = new InputStreamReader(
                        resource.getInputStream(),
                        StandardCharsets.UTF_8
                );

                CSVParser csvParser = new CSVParser(
                        reader,
                        CSVFormat.DEFAULT.builder()
                                .setHeader()
                                .setSkipHeaderRecord(true)
                                .setIgnoreSurroundingSpaces(true)
                                .build()
                )
        ) {
            for (CSVRecord record : csvParser) {

                // CSV 순서:
                // 0 코드
                // 1 건물이름
                // 2 층
                // 3 시설
                // 4 카테고리
                // 5 태그
                String code = record.get(0).trim();
                String floor = record.get(2).trim();
                String placesText = record.get(3).trim();
                String category = record.get(4).trim();
                String tags = record.get(5).trim();

                Building building = buildingRepository.findByCode(code)
                        .orElse(null);

                if (building == null) {
                    continue;
                }

                // 시설이 "학생식당,편의점"처럼 여러 개면 각각 저장
                String[] places = placesText.split(",");

                for (String p : places) {
                    String placeName = p.trim();

                    if (placeName.isBlank()) {
                        continue;
                    }

                    BuildingPlace buildingPlace = BuildingPlace.builder()
                            .building(building)
                            .floor(floor)
                            .place(placeName)
                            .category(category)
                            .tags(tags)
                            .build();

                    buildingPlaceRepository.save(buildingPlace);
                }
            }
        }

        System.out.println("건물 시설 CSV 로딩 완료 (카테고리/태그 포함)");
    }
}