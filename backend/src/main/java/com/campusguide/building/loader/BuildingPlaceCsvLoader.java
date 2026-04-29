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

        // 서버를 다시 실행할 때마다 같은 시설 데이터가 중복 저장되는 것을 막음
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
                                // 첫 번째 줄을 헤더로 사용
                                .setHeader()
                                // 헤더 줄은 실제 데이터로 읽지 않음
                                .setSkipHeaderRecord(true)
                                // 값 앞뒤 공백 무시
                                .setIgnoreSurroundingSpaces(true)
                                .build()
                )
        ) {
            for (CSVRecord record : csvParser) {

                /*
                 * 원래는 record.get("코드")처럼 헤더 이름으로 읽을 수 있음.
                 * 그런데 CSV 파일 첫 글자에 BOM이라는 숨은 문자가 붙으면
                 * "코드"가 아니라 "﻿코드"처럼 인식돼서 오류가 남.
                 *
                 * 그래서 여기서는 헤더 이름 대신 열 번호로 읽음.
                 *
                 * 0번: 코드
                 * 1번: 건물이름
                 * 2번: 층
                 * 3번: 시설
                 */
                String code = record.get(0).trim();
                String floor = record.get(2).trim();
                String placesText = record.get(3).trim();

                // building_info.csv의 코드와 buildings 테이블의 code를 연결
                Building building = buildingRepository.findByCode(code)
                        .orElse(null);

                // buildings 테이블에 해당 코드가 없으면 저장하지 않고 건너뜀
                if (building == null) {
                    continue;
                }

                /*
                 * 시설 칸에 여러 시설이 들어있는 경우가 있음.
                 * 예: "학생식당,편의점"
                 *
                 * 이걸 하나로 저장하면 "편의점 어디야?" 검색이 어려워짐.
                 * 그래서 쉼표 기준으로 나눠서 각각 저장함.
                 */
                String[] places = placesText.split(",");

                for (String p : places) {
                    String placeName = p.trim();

                    // 빈 값은 저장하지 않음
                    if (placeName.isBlank()) {
                        continue;
                    }

                    BuildingPlace buildingPlace = BuildingPlace.builder()
                            .building(building)
                            .floor(floor)
                            .place(placeName)
                            .build();

                    buildingPlaceRepository.save(buildingPlace);
                }
            }
        }

        System.out.println("건물 시설 CSV 로딩 완료 (정상)");
    }
}