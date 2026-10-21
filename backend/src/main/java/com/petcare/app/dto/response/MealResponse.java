package com.petcare.app.dto.response;

import com.petcare.app.enums.MealUnit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealResponse {

    private String id;
    private String foodName;
    private String foodBrand;
    private Double quantity;
    private MealUnit unit;
    private LocalTime scheduledTime;
    private String notes;
    private String animalId;
}
