package com.petcare.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssistantResponse {

    private String animalName;
    private String species;
    private List<String> symptoms;
    private String severity;
    private String advice;
    private List<String> recommendations;
    private String disclaimer;
}
