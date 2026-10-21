package com.petcare.app.entity;

import com.petcare.app.enums.Gender;
import com.petcare.app.enums.Species;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "animals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Animal {

    @Id
    private String id;

    @NotBlank
    private String name;

    @NotNull
    private Species species;

    private String breed;
    private LocalDate birthDate;
    private Double weight;
    private Gender gender;
    private String photoUrl;
    private String color;
    private String notes;
    private String chipNumber;

    @NotNull
    private String userId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
