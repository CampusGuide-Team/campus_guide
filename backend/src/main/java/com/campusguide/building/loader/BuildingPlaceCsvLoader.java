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

@Component
@RequiredArgsConstructor
public class BuildingPlaceCsvLoader implements CommandLineRunner {

    private final BuildingRepository buildingRepository;
    private final BuildingPlaceRepository buildingPlaceRepository;

    @Override
    public void run(String... args) throws Exception {

        // 중복 방지 서버 재시작 방지 하기 위한거임
        if (buildingPlaceRepository.count() > 0) {
            return;
        }

        ClassPathResource resource = new ClassPathResource("data/building_info.csv");

        try (
                Reader reader = new InputStreamReader(resource.getInputStream());
                CSVParser csvParser = new CSVParser(
                        reader,
                        CSVFormat.DEFAULT.builder()
                                .setHeader()
                                .setSkipHeaderRecord(true)
                                .build()
                )
        ) {
            for (CSVRecord record : csvParser) {

                String code = record.get("코드").trim();
                String floor = record.get("층").trim();
                String placesText = record.get("시설").trim();

                Building building = buildingRepository.findByCode(code)
                        .orElse(null);

                if (building == null) continue;

                // 쉼표로 여러 시설 분리
                String[] places = placesText.split(",");

                for (String p : places) {
                    String placeName = p.trim();

                    if (placeName.isBlank()) continue;

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