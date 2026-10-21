package com.petcare.app.dto.request;

import com.petcare.app.enums.Gender;
import com.petcare.app.enums.Species;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAnimalRequest {

    private String name;
    private Species species;
    private String breed;
    private LocalDate birthDate;
    private Double weight;
    private Gender gender;
    private String photoUrl;
    private String color;
    private String notes;
    private String chipNumber;
}
