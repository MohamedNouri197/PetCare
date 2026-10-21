package com.petcare.app.config;

import com.petcare.app.entity.*;
import com.petcare.app.enums.*;
import com.petcare.app.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AnimalRepository animalRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final VaccinationRepository vaccinationRepository;
    private final AppointmentRepository appointmentRepository;
    private final ReminderRepository reminderRepository;
    private final MealRepository mealRepository;
    private final WeightRecordRepository weightRecordRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, AnimalRepository animalRepository,
                           MedicalRecordRepository medicalRecordRepository,
                           VaccinationRepository vaccinationRepository,
                           AppointmentRepository appointmentRepository,
                           ReminderRepository reminderRepository,
                           MealRepository mealRepository,
                           WeightRecordRepository weightRecordRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.animalRepository = animalRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.vaccinationRepository = vaccinationRepository;
        this.appointmentRepository = appointmentRepository;
        this.reminderRepository = reminderRepository;
        this.mealRepository = mealRepository;
        this.weightRecordRepository = weightRecordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // Create demo user
        User user = User.builder()
                .email("demo@petcare.com")
                .password(passwordEncoder.encode("password123"))
                .firstName("Jean")
                .lastName("Dupont")
                .createdAt(LocalDateTime.now())
                .build();
        user = userRepository.save(user);

        // Create first animal - a dog
        Animal dog = Animal.builder()
                .name("Max")
                .species(Species.DOG)
                .breed("Golden Retriever")
                .birthDate(LocalDate.of(2021, 3, 15))
                .weight(32.5)
                .gender(Gender.MALE)
                .color("Dore")
                .notes("Tres joueur, adore l'eau")
                .chipNumber("250269812345678")
                .userId(user.getId())
                .build();
        dog = animalRepository.save(dog);

        // Create second animal - a cat
        Animal cat = Animal.builder()
                .name("Luna")
                .species(Species.CAT)
                .breed("Siamois")
                .birthDate(LocalDate.of(2022, 7, 20))
                .weight(4.2)
                .gender(Gender.FEMALE)
                .color("Creme et brun")
                .notes("Calme, aime dormir au soleil")
                .chipNumber("250269887654321")
                .userId(user.getId())
                .build();
        cat = animalRepository.save(cat);

        // Medical records for the dog
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Visite annuelle")
                .description("Bilan de sante complet. Tout est normal.")
                .date(LocalDate.of(2024, 1, 15))
                .veterinarian("Dr. Martin")
                .clinic("Clinique Veterinaire du Parc")
                .notes("Prochain bilan dans un an")
                .cost(new BigDecimal("65.00"))
                .animalId(dog.getId())
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.TREATMENT)
                .title("Traitement anti-parasitaire")
                .description("Application de traitement anti-puces et tiques")
                .date(LocalDate.of(2024, 4, 10))
                .veterinarian("Dr. Martin")
                .clinic("Clinique Veterinaire du Parc")
                .cost(new BigDecimal("35.00"))
                .animalId(dog.getId())
                .build());

        // Vaccinations for the dog
        vaccinationRepository.save(Vaccination.builder()
                .name("Rage")
                .date(LocalDate.of(2024, 1, 15))
                .nextDueDate(LocalDate.of(2025, 1, 15))
                .veterinarian("Dr. Martin")
                .clinic("Clinique Veterinaire du Parc")
                .batchNumber("RAB-2024-0156")
                .notes("Rappel annuel")
                .animalId(dog.getId())
                .build());

        vaccinationRepository.save(Vaccination.builder()
                .name("DHPP (Maladie de Carre, Hepatite, Parvovirose, Parainfluenza)")
                .date(LocalDate.of(2024, 1, 15))
                .nextDueDate(LocalDate.of(2025, 1, 15))
                .veterinarian("Dr. Martin")
                .clinic("Clinique Veterinaire du Parc")
                .batchNumber("DHPP-2024-0892")
                .animalId(dog.getId())
                .build());

        // Vaccination for the cat
        vaccinationRepository.save(Vaccination.builder()
                .name("Typhus (Panleucopenie feline)")
                .date(LocalDate.of(2024, 3, 10))
                .nextDueDate(LocalDate.of(2025, 3, 10))
                .veterinarian("Dr. Leroy")
                .clinic("Clinique Veterinaire du Parc")
                .batchNumber("TYP-2024-0234")
                .animalId(cat.getId())
                .build());

        // Appointments
        appointmentRepository.save(Appointment.builder()
                .title("Controle annuel Max")
                .dateTime(LocalDateTime.of(2025, 1, 15, 10, 0))
                .veterinarian("Dr. Martin")
                .clinic("Clinique Veterinaire du Parc")
                .type(AppointmentType.CHECKUP)
                .status(AppointmentStatus.SCHEDULED)
                .notes("Bilan annuel + rappel vaccins")
                .animalId(dog.getId())
                .build());

        appointmentRepository.save(Appointment.builder()
                .title("Toilettage Max")
                .dateTime(LocalDateTime.of(2024, 12, 20, 14, 30))
                .clinic("Salon de Toilettage Poils & Compagnie")
                .type(AppointmentType.GROOMING)
                .status(AppointmentStatus.SCHEDULED)
                .animalId(dog.getId())
                .build());

        // Reminders
        reminderRepository.save(Reminder.builder()
                .title("Traitement anti-puces Max")
                .message("Appliquer le traitement anti-puces mensuel")
                .dateTime(LocalDateTime.of(2024, 11, 10, 8, 0))
                .type(ReminderType.MEDICATION)
                .recurring(true)
                .recurringIntervalDays(30)
                .active(true)
                .animalId(dog.getId())
                .build());

        reminderRepository.save(Reminder.builder()
                .title("Vermifuge Luna")
                .message("Administrer le vermifuge trimestriel")
                .dateTime(LocalDateTime.of(2024, 12, 1, 8, 0))
                .type(ReminderType.MEDICATION)
                .recurring(true)
                .recurringIntervalDays(90)
                .active(true)
                .animalId(cat.getId())
                .build());

        // Meals for the dog
        mealRepository.save(Meal.builder()
                .foodName("Croquettes Premium Adult")
                .foodBrand("Royal Canin")
                .quantity(200.0)
                .unit(MealUnit.GRAMS)
                .scheduledTime(LocalTime.of(8, 0))
                .notes("Repas du matin")
                .animalId(dog.getId())
                .build());

        mealRepository.save(Meal.builder()
                .foodName("Croquettes Premium Adult")
                .foodBrand("Royal Canin")
                .quantity(200.0)
                .unit(MealUnit.GRAMS)
                .scheduledTime(LocalTime.of(18, 0))
                .notes("Repas du soir")
                .animalId(dog.getId())
                .build());

        // Meals for the cat
        mealRepository.save(Meal.builder()
                .foodName("Patee Feline")
                .foodBrand("Sheba")
                .quantity(85.0)
                .unit(MealUnit.GRAMS)
                .scheduledTime(LocalTime.of(7, 30))
                .notes("Patee du matin")
                .animalId(cat.getId())
                .build());

        mealRepository.save(Meal.builder()
                .foodName("Croquettes Indoor")
                .foodBrand("Hill's Science Plan")
                .quantity(40.0)
                .unit(MealUnit.GRAMS)
                .scheduledTime(LocalTime.of(12, 0))
                .notes("Completer avec croquettes en libre service")
                .animalId(cat.getId())
                .build());

        // Weight records for the dog
        weightRecordRepository.save(WeightRecord.builder()
                .weight(30.0)
                .date(LocalDate.of(2024, 1, 15))
                .notes("Poids lors de la visite annuelle")
                .animalId(dog.getId())
                .build());

        weightRecordRepository.save(WeightRecord.builder()
                .weight(31.5)
                .date(LocalDate.of(2024, 4, 10))
                .notes("Prise de poids normale")
                .animalId(dog.getId())
                .build());

        weightRecordRepository.save(WeightRecord.builder()
                .weight(32.5)
                .date(LocalDate.of(2024, 7, 15))
                .notes("Poids stable")
                .animalId(dog.getId())
                .build());

        // Weight records for the cat
        weightRecordRepository.save(WeightRecord.builder()
                .weight(3.8)
                .date(LocalDate.of(2024, 3, 10))
                .animalId(cat.getId())
                .build());

        weightRecordRepository.save(WeightRecord.builder()
                .weight(4.2)
                .date(LocalDate.of(2024, 9, 10))
                .notes("Poids ideal pour sa taille")
                .animalId(cat.getId())
                .build());

        System.out.println("=== Demo data initialized ===");
        System.out.println("User: demo@petcare.com / password123");
        System.out.println("Animals: Max (Golden Retriever), Luna (Siamois)");
        System.out.println("=============================");
    }
}
