package com.campusguide.building.loader;

import com.campusguide.building.entity.Building;
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
public class BuildingCsvLoader implements CommandLineRunner {

    private final BuildingRepository buildingRepository;

    @Override
    public void run(String... args) throws Exception {

        // 중복 저장 방지
        if (buildingRepository.count() > 0) {
            return;
        }

        ClassPathResource resource =
                new ClassPathResource("data/buildings.csv");

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

                String code = record.get("코드").trim();
                String name = record.get("건물이름").trim();

                Double latitude =
                        Double.parseDouble(record.get("위도").trim());

                Double longitude =
                        Double.parseDouble(record.get("경도").trim());

                String category =
                        record.get("카테고리").trim();

                String tags =
                        record.get("태그").trim();

                Building building = Building.builder()
                        .code(code)
                        .name(name)
                        .latitude(latitude)
                        .longitude(longitude)
                        .category(category)
                        .tags(tags)
                        .description(null)
                        .build();

                buildingRepository.save(building);
            }
        }

        System.out.println("건물 CSV 데이터 로딩 완료");
    }
}