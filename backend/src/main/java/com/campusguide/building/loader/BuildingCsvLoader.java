package com.campusguide.building.loader;

import com.campusguide.building.entity.Building;
import com.campusguide.building.repository.BuildingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Component
@RequiredArgsConstructor
public class BuildingCsvLoader implements CommandLineRunner {

    private final BuildingRepository buildingRepository;

    @Override
    public void run(String... args) throws Exception {

        // 이미 데이터가 있으면 로딩 안하게했음
        if(buildingRepository.count() > 0) {
            return;
        }

        BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                        getClass().getResourceAsStream("data/buildings.csv")
                )
        );

        String line;
        boolean firstLine = true;

        while((line = reader.readLine()) != null){

            if(firstLine){
                firstLine = false;
                continue;
            }

            String[] data = line.split(",");

            Building building = Building.builder()
                    .code(data[0])
                    .name(data[1])
                    .latitude(Double.parseDouble(data[2]))
                    .longitude(Double.parseDouble(data[3]))
                    .description(data[4])
                    .category(data[5])
                    .build();

            buildingRepository.save(building);
        }

        System.out.println("건물 CSV 데이터 로딩 완료");
    }
}