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

        // 이미 건물 데이터가 있으면 중복 저장 방지
        if (buildingRepository.count() > 0) {
            return;
        }

        // src/main/resources/data/buildings.csv 읽기
        ClassPathResource resource = new ClassPathResource("data/buildings.csv");

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

                // CSV 순서: 코드, 건물이름, 위도, 경도
                String code = record.get(0).trim();
                String name = record.get(1).trim();
                Double latitude = Double.parseDouble(record.get(2).trim());
                Double longitude = Double.parseDouble(record.get(3).trim());

                Building building = Building.builder()
                        .code(code)
                        .name(name)
                        .latitude(latitude)
                        .longitude(longitude)
                        // 현재 CSV에는 description/category 컬럼이 없어서 null로 둠
                        .description(null)
                        .category(null)
                        .build();

                buildingRepository.save(building);
            }
        }

        System.out.println("건물 CSV 데이터 로딩 완료");
    }
}