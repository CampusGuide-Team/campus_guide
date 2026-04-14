package com.campusguide.building.loader;

import com.campusguide.building.entity.Building;
import com.campusguide.building.entity.BuildingPlace;
import com.campusguide.building.repository.BuildingPlaceRepository;
import com.campusguide.building.repository.BuildingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Component
@RequiredArgsConstructor
public class BuildingPlaceCsvLoader implements CommandLineRunner {

    private final BuildingRepository buildingRepository;
    private final BuildingPlaceRepository buildingPlaceRepository;

    @Override
    public void run(String... args) throws Exception {

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                        getClass().getResourceAsStream("/data/building_info.csv")
                )
        );

        String line;
        boolean firstLine = true;

        while ((line = reader.readLine()) != null) {

            // 첫 줄 (헤더) 건너뛰기
            if (firstLine) {
                firstLine = false;
                continue;
            }

            String[] data = line.split(",");

            String code = data[0];
            String floor = data[2];
            String place = data[3];

            Building building = buildingRepository.findByCode(code)
                    .orElse(null);

            if (building == null) continue;

            BuildingPlace buildingPlace = BuildingPlace.builder()
                    .building(building)
                    .floor(floor)
                    .place(place)
                    .build();

            buildingPlaceRepository.save(buildingPlace);
        }

        System.out.println("건물 시설 CSV 로딩 완료함");
    }
}