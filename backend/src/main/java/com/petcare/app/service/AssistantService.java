package com.petcare.app.service;

import com.petcare.app.dto.request.AssistantRequest;
import com.petcare.app.dto.response.AssistantResponse;
import com.petcare.app.entity.Animal;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class AssistantService {

    private static final String DISCLAIMER = "Cet avis ne remplace pas un diagnostic veterinaire. " +
            "Consultez toujours un veterinaire qualifie pour tout probleme de sante de votre animal.";

    private static final Set<String> SEVERE_SYMPTOMS = Set.of(
            "bleeding", "saignement", "seizure", "convulsion", "unconscious", "inconscient",
            "difficulty breathing", "difficulte respiratoire", "not breathing", "ne respire pas",
            "poisoning", "empoisonnement", "fracture", "broken bone", "os casse",
            "bloated stomach", "estomac gonfle", "collapse", "effondrement",
            "paralysis", "paralysie", "severe pain", "douleur severe",
            "hit by car", "renverse par voiture", "choking", "etouffe"
    );

    private static final Set<String> MODERATE_SYMPTOMS = Set.of(
            "vomiting", "vomissement", "diarrhea", "diarrhee", "limping", "boiterie",
            "loss of appetite", "perte appetit", "lethargy", "lethargie",
            "coughing", "toux", "sneezing", "eternuement", "swelling", "gonflement",
            "itching", "demangeaison", "discharge", "ecoulement",
            "weight loss", "perte de poids", "fever", "fievre",
            "excessive thirst", "soif excessive", "frequent urination", "urination frequente"
    );

    private static final Set<String> MILD_SYMPTOMS = Set.of(
            "bad breath", "mauvaise haleine", "scratching", "grattage",
            "dry skin", "peau seche", "minor wound", "blessure mineure",
            "hiccups", "hoquet", "dandruff", "pellicules",
            "mild rash", "eruption legere", "snoring", "ronflement"
    );

    private final AnimalService animalService;

    public AssistantService(AnimalService animalService) {
        this.animalService = animalService;
    }

    public AssistantResponse getAdvice(AssistantRequest request, String userEmail) {
        Animal animal = animalService.getAnimalAndVerifyOwner(request.getAnimalId(), userEmail);

        List<String> symptoms = request.getSymptoms().stream()
                .map(String::toLowerCase)
                .toList();

        String severity = determineSeverity(symptoms);
        String advice = generateAdvice(severity, animal);
        List<String> recommendations = generateRecommendations(severity, symptoms, animal);

        return AssistantResponse.builder()
                .animalName(animal.getName())
                .species(animal.getSpecies().name())
                .symptoms(request.getSymptoms())
                .severity(severity)
                .advice(advice)
                .recommendations(recommendations)
                .disclaimer(DISCLAIMER)
                .build();
    }

    private String determineSeverity(List<String> symptoms) {
        for (String symptom : symptoms) {
            for (String severe : SEVERE_SYMPTOMS) {
                if (symptom.contains(severe)) {
                    return "SEVERE";
                }
            }
        }
        for (String symptom : symptoms) {
            for (String moderate : MODERATE_SYMPTOMS) {
                if (symptom.contains(moderate)) {
                    return "MODERATE";
                }
            }
        }
        for (String symptom : symptoms) {
            for (String mild : MILD_SYMPTOMS) {
                if (symptom.contains(mild)) {
                    return "MILD";
                }
            }
        }
        return "UNKNOWN";
    }

    private String generateAdvice(String severity, Animal animal) {
        String animalType = animal.getSpecies().name().toLowerCase();
        return switch (severity) {
            case "SEVERE" -> "URGENCE : Consultez un veterinaire immediatement. " +
                    "Les symptomes decrits pour " + animal.getName() + " (" + animalType + ") " +
                    "necessitent une attention medicale urgente. Ne tardez pas.";
            case "MODERATE" -> "ATTENTION : Surveillez attentivement " + animal.getName() + " (" + animalType + "). " +
                    "Si les symptomes persistent au-dela de 24-48 heures ou s'aggravent, " +
                    "consultez un veterinaire rapidement.";
            case "MILD" -> "INFO : Les symptomes decrits pour " + animal.getName() + " (" + animalType + ") " +
                    "semblent benins. Surveillez l'evolution et consultez un veterinaire " +
                    "si les symptomes persistent ou s'aggravent.";
            default -> "Les symptomes decrits pour " + animal.getName() + " (" + animalType + ") " +
                    "ne correspondent pas a notre base de donnees. " +
                    "Nous vous recommandons de consulter un veterinaire pour un diagnostic precis.";
        };
    }

    private List<String> generateRecommendations(String severity, List<String> symptoms, Animal animal) {
        List<String> recommendations = new ArrayList<>();

        switch (severity) {
            case "SEVERE" -> {
                recommendations.add("Rendez-vous aux urgences veterinaires les plus proches");
                recommendations.add("Ne donnez aucun medicament sans avis veterinaire");
                recommendations.add("Gardez " + animal.getName() + " au calme et au chaud");
                recommendations.add("Si possible, appelez le veterinaire en route pour preparer l'accueil");
            }
            case "MODERATE" -> {
                recommendations.add("Observez les symptomes pendant les prochaines 24 heures");
                recommendations.add("Assurez-vous que " + animal.getName() + " reste hydrate(e)");
                recommendations.add("Notez la frequence et l'intensite des symptomes");
                recommendations.add("Prenez rendez-vous chez le veterinaire si les symptomes persistent");
                if (symptoms.stream().anyMatch(s -> s.contains("vomit") || s.contains("diarr"))) {
                    recommendations.add("Mettez " + animal.getName() + " a la diete pendant 12 a 24 heures");
                }
            }
            case "MILD" -> {
                recommendations.add("Continuez a surveiller " + animal.getName());
                recommendations.add("Maintenez une alimentation equilibree et adaptee");
                recommendations.add("Assurez un environnement propre et confortable");
                if (symptoms.stream().anyMatch(s -> s.contains("skin") || s.contains("peau") || s.contains("scratch") || s.contains("gratt"))) {
                    recommendations.add("Verifiez l'absence de parasites (puces, tiques)");
                }
            }
            default -> {
                recommendations.add("Consultez un veterinaire pour un diagnostic precis");
                recommendations.add("Preparez une liste detaillee des symptomes observes");
                recommendations.add("Notez depuis quand les symptomes sont apparus");
            }
        }

        return recommendations;
    }
}
