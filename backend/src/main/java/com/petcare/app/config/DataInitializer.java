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

        // =============================================
        // UTILISATEURS - Contexte Tunisien
        // =============================================

        User amine = userRepository.save(User.builder()
                .email("amine@petcare.tn")
                .password(passwordEncoder.encode("amine1234"))
                .firstName("Mohamed Amine")
                .lastName("Nouri")
                .createdAt(LocalDateTime.now().minusDays(120))
                .build());

        User yasmine = userRepository.save(User.builder()
                .email("yasmine@petcare.tn")
                .password(passwordEncoder.encode("yasmine1234"))
                .firstName("Yasmine")
                .lastName("Ben Ali")
                .createdAt(LocalDateTime.now().minusDays(90))
                .build());

        User khalil = userRepository.save(User.builder()
                .email("khalil@petcare.tn")
                .password(passwordEncoder.encode("khalil1234"))
                .firstName("Khalil")
                .lastName("Trabelsi")
                .createdAt(LocalDateTime.now().minusDays(60))
                .build());

        User fatma = userRepository.save(User.builder()
                .email("fatma@petcare.tn")
                .password(passwordEncoder.encode("fatma1234"))
                .firstName("Fatma")
                .lastName("Bouazizi")
                .createdAt(LocalDateTime.now().minusDays(45))
                .build());

        User ahmed = userRepository.save(User.builder()
                .email("ahmed@petcare.tn")
                .password(passwordEncoder.encode("ahmed1234"))
                .firstName("Ahmed")
                .lastName("Mejri")
                .createdAt(LocalDateTime.now().minusDays(30))
                .build());

        // Compte demo
        User demo = userRepository.save(User.builder()
                .email("demo@petcare.tn")
                .password(passwordEncoder.encode("demo1234"))
                .firstName("Demo")
                .lastName("Utilisateur")
                .createdAt(LocalDateTime.now().minusDays(150))
                .build());

        // Compte veterinaire
        User vet = userRepository.save(User.builder()
                .email("vet@petcare.tn")
                .password(passwordEncoder.encode("vet1234"))
                .firstName("Dr. Sami")
                .lastName("Khelifi")
                .createdAt(LocalDateTime.now().minusDays(200))
                .build());

        // =============================================
        // ANIMAUX DE AMINE (4 animaux)
        // =============================================

        Animal rex = animalRepository.save(Animal.builder()
                .name("Rex")
                .species(Species.DOG)
                .breed("Berger Allemand")
                .birthDate(LocalDate.of(2021, 5, 10))
                .weight(34.0)
                .gender(Gender.MALE)
                .color("Noir et feu")
                .notes("Tres protecteur, garde la maison a La Marsa")
                .chipNumber("788269801234567")
                .userId(amine.getId())
                .createdAt(LocalDateTime.now().minusDays(100))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .build());

        Animal mimi = animalRepository.save(Animal.builder()
                .name("Mimi")
                .species(Species.CAT)
                .breed("Siamois")
                .birthDate(LocalDate.of(2022, 8, 15))
                .weight(4.5)
                .gender(Gender.FEMALE)
                .color("Creme et chocolat")
                .notes("Tres caline, dort sur le canape toute la journee")
                .chipNumber("788269801234568")
                .userId(amine.getId())
                .createdAt(LocalDateTime.now().minusDays(95))
                .updatedAt(LocalDateTime.now().minusDays(5))
                .build());

        Animal coco = animalRepository.save(Animal.builder()
                .name("Coco")
                .species(Species.BIRD)
                .breed("Perruche ondulée")
                .birthDate(LocalDate.of(2023, 3, 20))
                .weight(0.035)
                .gender(Gender.MALE)
                .color("Vert et jaune")
                .notes("Chante le matin, aime les graines de tournesol")
                .userId(amine.getId())
                .createdAt(LocalDateTime.now().minusDays(80))
                .updatedAt(LocalDateTime.now().minusDays(10))
                .build());

        Animal neige = animalRepository.save(Animal.builder()
                .name("Neige")
                .species(Species.RABBIT)
                .breed("Nain Belier")
                .birthDate(LocalDate.of(2023, 11, 5))
                .weight(1.9)
                .gender(Gender.FEMALE)
                .color("Blanc")
                .notes("Adore les carottes et le persil frais du marche central")
                .userId(amine.getId())
                .createdAt(LocalDateTime.now().minusDays(60))
                .updatedAt(LocalDateTime.now().minusDays(3))
                .build());

        // =============================================
        // ANIMAUX DE YASMINE (3 animaux)
        // =============================================

        Animal sultan = animalRepository.save(Animal.builder()
                .name("Sultan")
                .species(Species.DOG)
                .breed("Sloughi")
                .birthDate(LocalDate.of(2020, 2, 14))
                .weight(25.0)
                .gender(Gender.MALE)
                .color("Sable dore")
                .notes("Race tunisienne, tres rapide, promenades a Sidi Bou Said")
                .chipNumber("788269802345678")
                .userId(yasmine.getId())
                .createdAt(LocalDateTime.now().minusDays(85))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .build());

        Animal bella = animalRepository.save(Animal.builder()
                .name("Bella")
                .species(Species.CAT)
                .breed("Angora Turc")
                .birthDate(LocalDate.of(2021, 12, 1))
                .weight(5.2)
                .gender(Gender.FEMALE)
                .color("Blanc pur")
                .notes("Poils longs, necessite un brossage quotidien")
                .chipNumber("788269802345679")
                .userId(yasmine.getId())
                .createdAt(LocalDateTime.now().minusDays(80))
                .updatedAt(LocalDateTime.now().minusDays(4))
                .build());

        Animal oscar = animalRepository.save(Animal.builder()
                .name("Oscar")
                .species(Species.HAMSTER)
                .breed("Hamster dore")
                .birthDate(LocalDate.of(2024, 6, 10))
                .weight(0.12)
                .gender(Gender.MALE)
                .color("Dore et blanc")
                .notes("Tres actif la nuit, adore sa roue")
                .userId(yasmine.getId())
                .createdAt(LocalDateTime.now().minusDays(50))
                .updatedAt(LocalDateTime.now().minusDays(7))
                .build());

        // =============================================
        // ANIMAUX DE KHALIL (3 animaux)
        // =============================================

        Animal rocky = animalRepository.save(Animal.builder()
                .name("Rocky")
                .species(Species.DOG)
                .breed("Pitbull")
                .birthDate(LocalDate.of(2022, 1, 8))
                .weight(28.0)
                .gender(Gender.MALE)
                .color("Bringé")
                .notes("Doux malgre les apparences, adore les enfants")
                .chipNumber("788269803456789")
                .userId(khalil.getId())
                .createdAt(LocalDateTime.now().minusDays(55))
                .updatedAt(LocalDateTime.now().minusDays(6))
                .build());

        Animal luna = animalRepository.save(Animal.builder()
                .name("Luna")
                .species(Species.CAT)
                .breed("Chat de gouttiere")
                .birthDate(LocalDate.of(2023, 4, 17))
                .weight(3.8)
                .gender(Gender.FEMALE)
                .color("Tigree gris")
                .notes("Trouvee dans le quartier El Menzah, adoptee a 2 mois")
                .userId(khalil.getId())
                .createdAt(LocalDateTime.now().minusDays(50))
                .updatedAt(LocalDateTime.now().minusDays(8))
                .build());

        Animal nemo = animalRepository.save(Animal.builder()
                .name("Nemo")
                .species(Species.FISH)
                .breed("Poisson-clown")
                .birthDate(LocalDate.of(2024, 2, 1))
                .weight(0.02)
                .gender(Gender.MALE)
                .color("Orange et blanc")
                .notes("Aquarium 100L dans le salon, avec corail artificiel")
                .userId(khalil.getId())
                .createdAt(LocalDateTime.now().minusDays(40))
                .updatedAt(LocalDateTime.now().minusDays(15))
                .build());

        // =============================================
        // ANIMAUX DE FATMA (2 animaux)
        // =============================================

        Animal princesse = animalRepository.save(Animal.builder()
                .name("Princesse")
                .species(Species.CAT)
                .breed("Persan")
                .birthDate(LocalDate.of(2021, 9, 22))
                .weight(4.8)
                .gender(Gender.FEMALE)
                .color("Gris cendre")
                .notes("Nez ecrase, necessite nettoyage des yeux regulier")
                .chipNumber("788269804567890")
                .userId(fatma.getId())
                .createdAt(LocalDateTime.now().minusDays(40))
                .updatedAt(LocalDateTime.now().minusDays(2))
                .build());

        Animal simba = animalRepository.save(Animal.builder()
                .name("Simba")
                .species(Species.DOG)
                .breed("Caniche")
                .birthDate(LocalDate.of(2023, 7, 30))
                .weight(6.5)
                .gender(Gender.MALE)
                .color("Abricot")
                .notes("Toilettage tous les 2 mois chez Salon Vetcare Lac")
                .chipNumber("788269804567891")
                .userId(fatma.getId())
                .createdAt(LocalDateTime.now().minusDays(35))
                .updatedAt(LocalDateTime.now().minusDays(9))
                .build());

        // =============================================
        // ANIMAUX DE AHMED (3 animaux)
        // =============================================

        Animal balto = animalRepository.save(Animal.builder()
                .name("Balto")
                .species(Species.DOG)
                .breed("Husky Siberien")
                .birthDate(LocalDate.of(2022, 11, 11))
                .weight(23.5)
                .gender(Gender.MALE)
                .color("Gris et blanc")
                .notes("Supporte mal la chaleur de Tunis en ete, climatisation obligatoire")
                .chipNumber("788269805678901")
                .userId(ahmed.getId())
                .createdAt(LocalDateTime.now().minusDays(28))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .build());

        Animal caramel = animalRepository.save(Animal.builder()
                .name("Caramel")
                .species(Species.CAT)
                .breed("British Shorthair")
                .birthDate(LocalDate.of(2023, 5, 5))
                .weight(5.8)
                .gender(Gender.MALE)
                .color("Bleu (gris)")
                .notes("Achete a l'animalerie de la Soukra, tres gourmand")
                .chipNumber("788269805678902")
                .userId(ahmed.getId())
                .createdAt(LocalDateTime.now().minusDays(25))
                .updatedAt(LocalDateTime.now().minusDays(3))
                .build());

        Animal iguana = animalRepository.save(Animal.builder()
                .name("Drago")
                .species(Species.REPTILE)
                .breed("Iguane vert")
                .birthDate(LocalDate.of(2024, 1, 15))
                .weight(0.45)
                .gender(Gender.MALE)
                .color("Vert emeraude")
                .notes("Terrarium chauffe, alimentation vegetale uniquement")
                .userId(ahmed.getId())
                .createdAt(LocalDateTime.now().minusDays(20))
                .updatedAt(LocalDateTime.now().minusDays(12))
                .build());

        // =============================================
        // ANIMAUX DU COMPTE DEMO (3 animaux)
        // =============================================

        Animal max = animalRepository.save(Animal.builder()
                .name("Max")
                .species(Species.DOG)
                .breed("Golden Retriever")
                .birthDate(LocalDate.of(2021, 3, 15))
                .weight(32.5)
                .gender(Gender.MALE)
                .color("Dore")
                .notes("Tres joueur, promenades au Parc du Belvedere chaque matin")
                .chipNumber("788269800123456")
                .userId(demo.getId())
                .createdAt(LocalDateTime.now().minusDays(140))
                .updatedAt(LocalDateTime.now().minusDays(1))
                .build());

        Animal minette = animalRepository.save(Animal.builder()
                .name("Minette")
                .species(Species.CAT)
                .breed("Europeen")
                .birthDate(LocalDate.of(2022, 6, 20))
                .weight(4.0)
                .gender(Gender.FEMALE)
                .color("Ecaille de tortue")
                .notes("Trouvee pres de la Medina de Tunis, tres affectueuse")
                .chipNumber("788269800123457")
                .userId(demo.getId())
                .createdAt(LocalDateTime.now().minusDays(130))
                .updatedAt(LocalDateTime.now().minusDays(5))
                .build());

        Animal pirate = animalRepository.save(Animal.builder()
                .name("Pirate")
                .species(Species.BIRD)
                .breed("Calopsitte elegante")
                .birthDate(LocalDate.of(2023, 9, 1))
                .weight(0.09)
                .gender(Gender.MALE)
                .color("Gris avec joues orange")
                .notes("Siffle des melodies, tres sociable")
                .userId(demo.getId())
                .createdAt(LocalDateTime.now().minusDays(100))
                .updatedAt(LocalDateTime.now().minusDays(14))
                .build());

        // =============================================
        // DOSSIERS MEDICAUX (25+ enregistrements)
        // =============================================

        // Rex - Amine
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Bilan annuel complet")
                .description("Examen general, auscultation, palpation abdominale. RAS.")
                .date(LocalDate.now().minusDays(30))
                .veterinarian("Dr. Sami Khelifi")
                .clinic("Clinique Veterinaire El Manar, Tunis")
                .notes("Animal en bonne sante, continuer le regime actuel")
                .cost(new BigDecimal("85.000"))
                .animalId(rex.getId())
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.TREATMENT)
                .title("Traitement anti-parasitaire")
                .description("Application Frontline Combo contre puces et tiques")
                .date(LocalDate.now().minusDays(60))
                .veterinarian("Dr. Sami Khelifi")
                .clinic("Clinique Veterinaire El Manar, Tunis")
                .cost(new BigDecimal("45.000"))
                .animalId(rex.getId())
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.EXAM)
                .title("Radiographie hanche")
                .description("Controle de dysplasie. Resultats normaux, pas de signe de dysplasie.")
                .date(LocalDate.now().minusDays(120))
                .veterinarian("Dr. Leila Hammami")
                .clinic("Centre Veterinaire Lac 2, Tunis")
                .notes("Prochain controle dans 1 an")
                .cost(new BigDecimal("120.000"))
                .animalId(rex.getId())
                .build());

        // Mimi - Amine
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Allergie cutanee")
                .description("Demangeaisons et rougeurs au niveau du cou. Prescrit antihistaminique.")
                .date(LocalDate.now().minusDays(20))
                .veterinarian("Dr. Sami Khelifi")
                .clinic("Clinique Veterinaire El Manar, Tunis")
                .notes("Eviter les croquettes au poulet")
                .cost(new BigDecimal("65.000"))
                .animalId(mimi.getId())
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.SURGERY)
                .title("Sterilisation")
                .description("Ovariectomie sous anesthesie generale. Intervention sans complication.")
                .date(LocalDate.now().minusDays(180))
                .veterinarian("Dr. Leila Hammami")
                .clinic("Centre Veterinaire Lac 2, Tunis")
                .notes("Retrait des fils apres 10 jours")
                .cost(new BigDecimal("180.000"))
                .animalId(mimi.getId())
                .build());

        // Sultan - Yasmine
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Boiterie patte avant droite")
                .description("Legere entorse du carpe apres course a la plage de Gammarth. Repos 7 jours.")
                .date(LocalDate.now().minusDays(15))
                .veterinarian("Dr. Nabil Saidi")
                .clinic("Veterinaire Sidi Bou Said")
                .notes("Anti-inflammatoire pendant 5 jours")
                .cost(new BigDecimal("75.000"))
                .animalId(sultan.getId())
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.TREATMENT)
                .title("Detartrage dentaire")
                .description("Detartrage complet sous sedation. Gencives en bon etat.")
                .date(LocalDate.now().minusDays(90))
                .veterinarian("Dr. Nabil Saidi")
                .clinic("Veterinaire Sidi Bou Said")
                .cost(new BigDecimal("95.000"))
                .animalId(sultan.getId())
                .build());

        // Bella - Yasmine
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Probleme oculaire")
                .description("Larmoiement excessif oeil gauche. Prescrit collyre antibiotique.")
                .date(LocalDate.now().minusDays(10))
                .veterinarian("Dr. Nabil Saidi")
                .clinic("Veterinaire Sidi Bou Said")
                .cost(new BigDecimal("55.000"))
                .animalId(bella.getId())
                .build());

        // Rocky - Khalil
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Bilan annuel")
                .description("Examen complet. Bon etat general. Poids stable.")
                .date(LocalDate.now().minusDays(25))
                .veterinarian("Dr. Imen Gharbi")
                .clinic("Clinique Veterinaire El Menzah, Tunis")
                .notes("Regimer hypoallergenique recommande")
                .cost(new BigDecimal("70.000"))
                .animalId(rocky.getId())
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.TREATMENT)
                .title("Otite externe")
                .description("Nettoyage auriculaire + traitement topique. Controle dans 10 jours.")
                .date(LocalDate.now().minusDays(45))
                .veterinarian("Dr. Imen Gharbi")
                .clinic("Clinique Veterinaire El Menzah, Tunis")
                .cost(new BigDecimal("50.000"))
                .animalId(rocky.getId())
                .build());

        // Luna - Khalil
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.SURGERY)
                .title("Sterilisation")
                .description("Sterilisation realisee avec succes. Recuperation rapide.")
                .date(LocalDate.now().minusDays(150))
                .veterinarian("Dr. Imen Gharbi")
                .clinic("Clinique Veterinaire El Menzah, Tunis")
                .cost(new BigDecimal("150.000"))
                .animalId(luna.getId())
                .build());

        // Princesse - Fatma
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Probleme respiratoire")
                .description("Difficulte respiratoire legere liee au nez ecrase (brachycephale). Surveillance.")
                .date(LocalDate.now().minusDays(18))
                .veterinarian("Dr. Anis Mathlouthi")
                .clinic("Clinique Veterinaire Les Berges du Lac, Tunis")
                .notes("Eviter les efforts par temps chaud")
                .cost(new BigDecimal("90.000"))
                .animalId(princesse.getId())
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.TREATMENT)
                .title("Nettoyage yeux et oreilles")
                .description("Soins de routine pour race Persan. Nettoyage occulaire + auriculaire.")
                .date(LocalDate.now().minusDays(40))
                .veterinarian("Dr. Anis Mathlouthi")
                .clinic("Clinique Veterinaire Les Berges du Lac, Tunis")
                .cost(new BigDecimal("35.000"))
                .animalId(princesse.getId())
                .build());

        // Simba - Fatma
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Vaccination et bilan")
                .description("Bilan complet. Rappel vaccins effectue. Tres bon etat.")
                .date(LocalDate.now().minusDays(35))
                .veterinarian("Dr. Anis Mathlouthi")
                .clinic("Clinique Veterinaire Les Berges du Lac, Tunis")
                .cost(new BigDecimal("80.000"))
                .animalId(simba.getId())
                .build());

        // Balto - Ahmed
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Coup de chaleur")
                .description("Episode de coup de chaleur en aout. Rehydratation IV. Surveillance 24h.")
                .date(LocalDate.now().minusDays(80))
                .veterinarian("Dr. Sami Khelifi")
                .clinic("Clinique Veterinaire El Manar, Tunis")
                .notes("Limiter les sorties entre 11h et 17h en ete")
                .cost(new BigDecimal("130.000"))
                .animalId(balto.getId())
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.EXAM)
                .title("Bilan sanguin complet")
                .description("NFS, biochimie, thyroide. Resultats dans les normes.")
                .date(LocalDate.now().minusDays(30))
                .veterinarian("Dr. Sami Khelifi")
                .clinic("Clinique Veterinaire El Manar, Tunis")
                .cost(new BigDecimal("95.000"))
                .animalId(balto.getId())
                .build());

        // Max - Demo
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Visite annuelle")
                .description("Bilan complet. Poids stable. Dentition en bon etat.")
                .date(LocalDate.now().minusDays(20))
                .veterinarian("Dr. Sami Khelifi")
                .clinic("Clinique Veterinaire El Manar, Tunis")
                .notes("Prochain bilan dans 12 mois")
                .cost(new BigDecimal("85.000"))
                .animalId(max.getId())
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.TREATMENT)
                .title("Traitement anti-puces")
                .description("Application Bravecto comprime. Protection 3 mois.")
                .date(LocalDate.now().minusDays(20))
                .veterinarian("Dr. Sami Khelifi")
                .clinic("Clinique Veterinaire El Manar, Tunis")
                .cost(new BigDecimal("55.000"))
                .animalId(max.getId())
                .build());

        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.SURGERY)
                .title("Extraction dentaire")
                .description("Extraction d'une premolaire fracturee sous anesthesie generale.")
                .date(LocalDate.now().minusDays(200))
                .veterinarian("Dr. Leila Hammami")
                .clinic("Centre Veterinaire Lac 2, Tunis")
                .cost(new BigDecimal("200.000"))
                .animalId(max.getId())
                .build());

        // Minette - Demo
        medicalRecordRepository.save(MedicalRecord.builder()
                .type(MedicalRecordType.CONSULTATION)
                .title("Gastro-enterite")
                .description("Vomissements et diarrhee. Prescrit anti-emetique + diete 24h.")
                .date(LocalDate.now().minusDays(45))
                .veterinarian("Dr. Sami Khelifi")
                .clinic("Clinique Veterinaire El Manar, Tunis")
                .cost(new BigDecimal("60.000"))
                .animalId(minette.getId())
                .build());

        // =============================================
        // VACCINATIONS (30+ enregistrements)
        // =============================================

        // Rex
        vaccinationRepository.save(Vaccination.builder().name("Rage").date(LocalDate.now().minusDays(30)).nextDueDate(LocalDate.now().plusDays(335)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("RAB-2026-TN-0891").animalId(rex.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("DHPP").date(LocalDate.now().minusDays(30)).nextDueDate(LocalDate.now().plusDays(335)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("DHP-2026-TN-1204").animalId(rex.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("Leptospirose").date(LocalDate.now().minusDays(180)).nextDueDate(LocalDate.now().plusDays(10)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("LEP-2026-TN-0332").notes("Rappel bientot").animalId(rex.getId()).build());

        // Mimi
        vaccinationRepository.save(Vaccination.builder().name("Typhus").date(LocalDate.now().minusDays(45)).nextDueDate(LocalDate.now().plusDays(320)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("TYP-2026-TN-0556").animalId(mimi.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("Coryza").date(LocalDate.now().minusDays(45)).nextDueDate(LocalDate.now().plusDays(320)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("COR-2026-TN-0771").animalId(mimi.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("Leucose feline (FeLV)").date(LocalDate.now().minusDays(200)).nextDueDate(LocalDate.now().minusDays(5)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("FLV-2025-TN-0120").notes("EN RETARD - rappel urgent").animalId(mimi.getId()).build());

        // Sultan
        vaccinationRepository.save(Vaccination.builder().name("Rage").date(LocalDate.now().minusDays(60)).nextDueDate(LocalDate.now().plusDays(305)).veterinarian("Dr. Nabil Saidi").clinic("Veterinaire Sidi Bou Said").batchNumber("RAB-2026-TN-0445").animalId(sultan.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("DHPP").date(LocalDate.now().minusDays(60)).nextDueDate(LocalDate.now().plusDays(305)).veterinarian("Dr. Nabil Saidi").clinic("Veterinaire Sidi Bou Said").batchNumber("DHP-2026-TN-0667").animalId(sultan.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("Leishmaniose").date(LocalDate.now().minusDays(60)).nextDueDate(LocalDate.now().plusDays(305)).veterinarian("Dr. Nabil Saidi").clinic("Veterinaire Sidi Bou Said").batchNumber("LEI-2026-TN-0102").notes("Important en zone mediterraneenne").animalId(sultan.getId()).build());

        // Bella
        vaccinationRepository.save(Vaccination.builder().name("Typhus").date(LocalDate.now().minusDays(90)).nextDueDate(LocalDate.now().plusDays(275)).veterinarian("Dr. Nabil Saidi").clinic("Veterinaire Sidi Bou Said").batchNumber("TYP-2026-TN-0889").animalId(bella.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("Coryza").date(LocalDate.now().minusDays(90)).nextDueDate(LocalDate.now().plusDays(275)).veterinarian("Dr. Nabil Saidi").clinic("Veterinaire Sidi Bou Said").batchNumber("COR-2026-TN-0445").animalId(bella.getId()).build());

        // Rocky
        vaccinationRepository.save(Vaccination.builder().name("Rage").date(LocalDate.now().minusDays(25)).nextDueDate(LocalDate.now().plusDays(340)).veterinarian("Dr. Imen Gharbi").clinic("Clinique El Menzah").batchNumber("RAB-2026-TN-1102").animalId(rocky.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("DHPP").date(LocalDate.now().minusDays(25)).nextDueDate(LocalDate.now().plusDays(340)).veterinarian("Dr. Imen Gharbi").clinic("Clinique El Menzah").batchNumber("DHP-2026-TN-0998").animalId(rocky.getId()).build());

        // Luna
        vaccinationRepository.save(Vaccination.builder().name("Typhus").date(LocalDate.now().minusDays(100)).nextDueDate(LocalDate.now().plusDays(265)).veterinarian("Dr. Imen Gharbi").clinic("Clinique El Menzah").batchNumber("TYP-2026-TN-0334").animalId(luna.getId()).build());

        // Princesse
        vaccinationRepository.save(Vaccination.builder().name("Typhus").date(LocalDate.now().minusDays(50)).nextDueDate(LocalDate.now().plusDays(315)).veterinarian("Dr. Anis Mathlouthi").clinic("Clinique Les Berges du Lac").batchNumber("TYP-2026-TN-0776").animalId(princesse.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("Coryza").date(LocalDate.now().minusDays(50)).nextDueDate(LocalDate.now().plusDays(315)).veterinarian("Dr. Anis Mathlouthi").clinic("Clinique Les Berges du Lac").batchNumber("COR-2026-TN-0221").animalId(princesse.getId()).build());

        // Simba
        vaccinationRepository.save(Vaccination.builder().name("Rage").date(LocalDate.now().minusDays(35)).nextDueDate(LocalDate.now().plusDays(330)).veterinarian("Dr. Anis Mathlouthi").clinic("Clinique Les Berges du Lac").batchNumber("RAB-2026-TN-0553").animalId(simba.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("DHPP").date(LocalDate.now().minusDays(35)).nextDueDate(LocalDate.now().plusDays(330)).veterinarian("Dr. Anis Mathlouthi").clinic("Clinique Les Berges du Lac").batchNumber("DHP-2026-TN-0412").animalId(simba.getId()).build());

        // Balto
        vaccinationRepository.save(Vaccination.builder().name("Rage").date(LocalDate.now().minusDays(40)).nextDueDate(LocalDate.now().plusDays(325)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("RAB-2026-TN-0712").animalId(balto.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("DHPP").date(LocalDate.now().minusDays(40)).nextDueDate(LocalDate.now().plusDays(325)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("DHP-2026-TN-0831").animalId(balto.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("Piroplasmose").date(LocalDate.now().minusDays(150)).nextDueDate(LocalDate.now().plusDays(30)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("PIR-2026-TN-0055").notes("A surveiller, bientot du").animalId(balto.getId()).build());

        // Max - Demo
        vaccinationRepository.save(Vaccination.builder().name("Rage").date(LocalDate.now().minusDays(20)).nextDueDate(LocalDate.now().plusDays(345)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("RAB-2026-TN-1301").animalId(max.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("DHPP").date(LocalDate.now().minusDays(20)).nextDueDate(LocalDate.now().plusDays(345)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("DHP-2026-TN-1155").animalId(max.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("Leptospirose").date(LocalDate.now().minusDays(20)).nextDueDate(LocalDate.now().plusDays(345)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("LEP-2026-TN-0489").animalId(max.getId()).build());

        // Minette - Demo
        vaccinationRepository.save(Vaccination.builder().name("Typhus").date(LocalDate.now().minusDays(60)).nextDueDate(LocalDate.now().plusDays(305)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("TYP-2026-TN-0998").animalId(minette.getId()).build());
        vaccinationRepository.save(Vaccination.builder().name("Coryza").date(LocalDate.now().minusDays(60)).nextDueDate(LocalDate.now().plusDays(305)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar").batchNumber("COR-2026-TN-1002").animalId(minette.getId()).build());

        // =============================================
        // RENDEZ-VOUS (15+ enregistrements)
        // =============================================

        appointmentRepository.save(Appointment.builder().title("Rappel vaccin Leptospirose Rex").dateTime(LocalDateTime.now().plusDays(10).withHour(10).withMinute(0)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar, Tunis").type(AppointmentType.VACCINATION).status(AppointmentStatus.SCHEDULED).notes("Rappel annuel").animalId(rex.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Rappel vaccin FeLV Mimi").dateTime(LocalDateTime.now().plusDays(3).withHour(14).withMinute(30)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar, Tunis").type(AppointmentType.VACCINATION).status(AppointmentStatus.SCHEDULED).notes("Vaccin en retard").animalId(mimi.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Controle boiterie Sultan").dateTime(LocalDateTime.now().plusDays(5).withHour(11).withMinute(0)).veterinarian("Dr. Nabil Saidi").clinic("Veterinaire Sidi Bou Said").type(AppointmentType.CHECKUP).status(AppointmentStatus.SCHEDULED).animalId(sultan.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Toilettage Bella").dateTime(LocalDateTime.now().plusDays(7).withHour(9).withMinute(30)).clinic("Salon Toilettage La Marsa").type(AppointmentType.GROOMING).status(AppointmentStatus.SCHEDULED).animalId(bella.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Controle otite Rocky").dateTime(LocalDateTime.now().plusDays(2).withHour(16).withMinute(0)).veterinarian("Dr. Imen Gharbi").clinic("Clinique Veterinaire El Menzah, Tunis").type(AppointmentType.CHECKUP).status(AppointmentStatus.SCHEDULED).animalId(rocky.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Bilan annuel Princesse").dateTime(LocalDateTime.now().plusDays(12).withHour(10).withMinute(30)).veterinarian("Dr. Anis Mathlouthi").clinic("Clinique Les Berges du Lac, Tunis").type(AppointmentType.CHECKUP).status(AppointmentStatus.SCHEDULED).animalId(princesse.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Toilettage Simba").dateTime(LocalDateTime.now().plusDays(8).withHour(14).withMinute(0)).clinic("Salon Vetcare Lac, Tunis").type(AppointmentType.GROOMING).status(AppointmentStatus.SCHEDULED).animalId(simba.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Rappel Piroplasmose Balto").dateTime(LocalDateTime.now().plusDays(15).withHour(9).withMinute(0)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar, Tunis").type(AppointmentType.VACCINATION).status(AppointmentStatus.SCHEDULED).animalId(balto.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Bilan annuel Max").dateTime(LocalDateTime.now().plusDays(20).withHour(10).withMinute(0)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar, Tunis").type(AppointmentType.CHECKUP).status(AppointmentStatus.SCHEDULED).notes("Bilan + rappel vaccins").animalId(max.getId()).build());

        // Rendez-vous passes
        appointmentRepository.save(Appointment.builder().title("Bilan annuel Rex").dateTime(LocalDateTime.now().minusDays(30).withHour(10).withMinute(0)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar, Tunis").type(AppointmentType.CHECKUP).status(AppointmentStatus.COMPLETED).animalId(rex.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Sterilisation Mimi").dateTime(LocalDateTime.now().minusDays(180).withHour(8).withMinute(30)).veterinarian("Dr. Leila Hammami").clinic("Centre Veterinaire Lac 2, Tunis").type(AppointmentType.SURGERY).status(AppointmentStatus.COMPLETED).animalId(mimi.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Visite Sultan urgence").dateTime(LocalDateTime.now().minusDays(15).withHour(17).withMinute(0)).veterinarian("Dr. Nabil Saidi").clinic("Veterinaire Sidi Bou Said").type(AppointmentType.CHECKUP).status(AppointmentStatus.COMPLETED).animalId(sultan.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Controle annuel Rocky").dateTime(LocalDateTime.now().minusDays(25).withHour(15).withMinute(0)).veterinarian("Dr. Imen Gharbi").clinic("Clinique Veterinaire El Menzah, Tunis").type(AppointmentType.CHECKUP).status(AppointmentStatus.COMPLETED).animalId(rocky.getId()).build());
        appointmentRepository.save(Appointment.builder().title("Vaccination Max").dateTime(LocalDateTime.now().minusDays(20).withHour(10).withMinute(0)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar, Tunis").type(AppointmentType.VACCINATION).status(AppointmentStatus.COMPLETED).animalId(max.getId()).build());
        appointmentRepository.save(Appointment.builder().title("RDV annule - Caramel").dateTime(LocalDateTime.now().minusDays(5).withHour(11).withMinute(0)).veterinarian("Dr. Sami Khelifi").clinic("Clinique Veterinaire El Manar, Tunis").type(AppointmentType.CHECKUP).status(AppointmentStatus.CANCELLED).notes("Report pour la semaine prochaine").animalId(caramel.getId()).build());

        // =============================================
        // RAPPELS (15+ enregistrements)
        // =============================================

        reminderRepository.save(Reminder.builder().title("Anti-puces Rex").message("Appliquer Frontline Combo").dateTime(LocalDateTime.now().plusDays(15).withHour(8).withMinute(0)).type(ReminderType.MEDICATION).recurring(true).recurringIntervalDays(30).active(true).animalId(rex.getId()).build());
        reminderRepository.save(Reminder.builder().title("Vermifuge Rex").message("Donner 1 comprime Milbemax").dateTime(LocalDateTime.now().plusDays(25).withHour(8).withMinute(0)).type(ReminderType.MEDICATION).recurring(true).recurringIntervalDays(90).active(true).animalId(rex.getId()).build());
        reminderRepository.save(Reminder.builder().title("Vaccin FeLV Mimi URGENT").message("Rappel vaccin Leucose en retard !").dateTime(LocalDateTime.now().withHour(9).withMinute(0)).type(ReminderType.VACCINATION).recurring(false).active(true).animalId(mimi.getId()).build());
        reminderRepository.save(Reminder.builder().title("Brossage Bella").message("Brossage quotidien poils longs").dateTime(LocalDateTime.now().plusDays(1).withHour(18).withMinute(0)).type(ReminderType.GROOMING).recurring(true).recurringIntervalDays(1).active(true).animalId(bella.getId()).build());
        reminderRepository.save(Reminder.builder().title("Promenade Sultan").message("Promenade a Sidi Bou Said - eviter heures chaudes").dateTime(LocalDateTime.now().plusDays(1).withHour(7).withMinute(0)).type(ReminderType.OTHER).recurring(true).recurringIntervalDays(1).active(true).animalId(sultan.getId()).build());
        reminderRepository.save(Reminder.builder().title("Nettoyage aquarium Nemo").message("Changement partiel eau 20% + nettoyage filtre").dateTime(LocalDateTime.now().plusDays(3).withHour(10).withMinute(0)).type(ReminderType.OTHER).recurring(true).recurringIntervalDays(7).active(true).animalId(nemo.getId()).build());
        reminderRepository.save(Reminder.builder().title("Nettoyage yeux Princesse").message("Nettoyer les yeux avec serum physiologique").dateTime(LocalDateTime.now().plusDays(1).withHour(9).withMinute(0)).type(ReminderType.GROOMING).recurring(true).recurringIntervalDays(2).active(true).animalId(princesse.getId()).build());
        reminderRepository.save(Reminder.builder().title("Toilettage Simba").message("RDV toilettage Salon Vetcare Lac").dateTime(LocalDateTime.now().plusDays(8).withHour(14).withMinute(0)).type(ReminderType.GROOMING).recurring(true).recurringIntervalDays(60).active(true).animalId(simba.getId()).build());
        reminderRepository.save(Reminder.builder().title("Climatisation Balto").message("Verifier que la clim fonctionne - essentiel pour Husky a Tunis").dateTime(LocalDateTime.now().plusDays(1).withHour(8).withMinute(0)).type(ReminderType.OTHER).recurring(false).active(true).animalId(balto.getId()).build());
        reminderRepository.save(Reminder.builder().title("Anti-puces Max").message("Comprime Bravecto tous les 3 mois").dateTime(LocalDateTime.now().plusDays(70).withHour(8).withMinute(0)).type(ReminderType.MEDICATION).recurring(true).recurringIntervalDays(90).active(true).animalId(max.getId()).build());
        reminderRepository.save(Reminder.builder().title("Vermifuge Minette").message("Vermifuge trimestriel").dateTime(LocalDateTime.now().plusDays(30).withHour(8).withMinute(0)).type(ReminderType.MEDICATION).recurring(true).recurringIntervalDays(90).active(true).animalId(minette.getId()).build());
        reminderRepository.save(Reminder.builder().title("Cage Coco").message("Nettoyage complet de la cage + graines fraiches").dateTime(LocalDateTime.now().plusDays(2).withHour(9).withMinute(0)).type(ReminderType.GROOMING).recurring(true).recurringIntervalDays(7).active(true).animalId(coco.getId()).build());
        reminderRepository.save(Reminder.builder().title("Nourriture Drago").message("Preparer salade (laitue, courgette, carotte rapee)").dateTime(LocalDateTime.now().plusDays(1).withHour(11).withMinute(0)).type(ReminderType.FOOD).recurring(true).recurringIntervalDays(1).active(true).animalId(iguana.getId()).build());
        reminderRepository.save(Reminder.builder().title("Litiere Oscar").message("Changer la litiere du hamster").dateTime(LocalDateTime.now().plusDays(4).withHour(17).withMinute(0)).type(ReminderType.GROOMING).recurring(true).recurringIntervalDays(3).active(true).animalId(oscar.getId()).build());
        reminderRepository.save(Reminder.builder().title("Cage Neige").message("Nettoyage cage + foin frais").dateTime(LocalDateTime.now().plusDays(2).withHour(10).withMinute(0)).type(ReminderType.GROOMING).recurring(true).recurringIntervalDays(3).active(true).animalId(neige.getId()).build());

        // =============================================
        // REPAS (20+ enregistrements)
        // =============================================

        // Rex
        mealRepository.save(Meal.builder().foodName("Croquettes Pro Plan Large").foodBrand("Purina Pro Plan").quantity(250.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(7, 0)).notes("Repas du matin").animalId(rex.getId()).build());
        mealRepository.save(Meal.builder().foodName("Croquettes Pro Plan Large").foodBrand("Purina Pro Plan").quantity(300.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(18, 30)).notes("Repas du soir").animalId(rex.getId()).build());

        // Mimi
        mealRepository.save(Meal.builder().foodName("Patee Feline Sensible").foodBrand("Royal Canin").quantity(85.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(7, 30)).notes("Patee hypoallergenique (sans poulet)").animalId(mimi.getId()).build());
        mealRepository.save(Meal.builder().foodName("Croquettes Hypoallergenic").foodBrand("Royal Canin").quantity(40.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(18, 0)).animalId(mimi.getId()).build());

        // Sultan
        mealRepository.save(Meal.builder().foodName("Croquettes Adult Medium").foodBrand("Acana").quantity(200.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(6, 30)).notes("Avant la promenade du matin").animalId(sultan.getId()).build());
        mealRepository.save(Meal.builder().foodName("Croquettes Adult Medium").foodBrand("Acana").quantity(200.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(19, 0)).animalId(sultan.getId()).build());

        // Bella
        mealRepository.save(Meal.builder().foodName("Patee Persian Adult").foodBrand("Royal Canin").quantity(85.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(8, 0)).animalId(bella.getId()).build());
        mealRepository.save(Meal.builder().foodName("Croquettes Persian Adult").foodBrand("Royal Canin").quantity(50.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(13, 0)).notes("Libre service midi").animalId(bella.getId()).build());

        // Rocky
        mealRepository.save(Meal.builder().foodName("Croquettes Maxi Adult").foodBrand("Royal Canin").quantity(200.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(7, 0)).animalId(rocky.getId()).build());
        mealRepository.save(Meal.builder().foodName("Croquettes Maxi Adult").foodBrand("Royal Canin").quantity(250.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(18, 0)).animalId(rocky.getId()).build());

        // Princesse
        mealRepository.save(Meal.builder().foodName("Patee Persian").foodBrand("Whiskas").quantity(80.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(7, 30)).animalId(princesse.getId()).build());
        mealRepository.save(Meal.builder().foodName("Croquettes Indoor").foodBrand("Hill's Science Plan").quantity(35.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(17, 30)).animalId(princesse.getId()).build());

        // Simba
        mealRepository.save(Meal.builder().foodName("Croquettes Mini Adult").foodBrand("Royal Canin").quantity(80.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(7, 30)).animalId(simba.getId()).build());
        mealRepository.save(Meal.builder().foodName("Croquettes Mini Adult").foodBrand("Royal Canin").quantity(80.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(18, 30)).animalId(simba.getId()).build());

        // Balto
        mealRepository.save(Meal.builder().foodName("Croquettes Husky Active").foodBrand("Orijen").quantity(200.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(6, 30)).notes("Riche en proteines").animalId(balto.getId()).build());
        mealRepository.save(Meal.builder().foodName("Croquettes Husky Active").foodBrand("Orijen").quantity(250.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(19, 0)).animalId(balto.getId()).build());

        // Max - Demo
        mealRepository.save(Meal.builder().foodName("Croquettes Golden Retriever").foodBrand("Royal Canin").quantity(200.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(7, 0)).notes("Repas du matin").animalId(max.getId()).build());
        mealRepository.save(Meal.builder().foodName("Croquettes Golden Retriever").foodBrand("Royal Canin").quantity(250.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(18, 30)).notes("Repas du soir").animalId(max.getId()).build());

        // Minette - Demo
        mealRepository.save(Meal.builder().foodName("Patee Feline").foodBrand("Sheba").quantity(85.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(7, 30)).animalId(minette.getId()).build());
        mealRepository.save(Meal.builder().foodName("Croquettes Sterilise").foodBrand("Purina ONE").quantity(40.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(18, 0)).animalId(minette.getId()).build());

        // Coco
        mealRepository.save(Meal.builder().foodName("Melange graines perruche").foodBrand("Versele-Laga").quantity(15.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(8, 0)).notes("+ morceau de pomme frais").animalId(coco.getId()).build());

        // Neige
        mealRepository.save(Meal.builder().foodName("Granules lapin nain").foodBrand("Oxbow").quantity(30.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(8, 0)).notes("+ foin a volonte + legumes frais du souk").animalId(neige.getId()).build());

        // Drago
        mealRepository.save(Meal.builder().foodName("Salade verte mixte").foodBrand("Marche Tunis").quantity(50.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(11, 0)).notes("Laitue, courgette, carotte rapee, pissenlit").animalId(iguana.getId()).build());

        // Oscar
        mealRepository.save(Meal.builder().foodName("Mix hamster complet").foodBrand("Vitakraft").quantity(10.0).unit(MealUnit.GRAMS).scheduledTime(LocalTime.of(18, 0)).notes("+ morceaux de fruits secs en friandise").animalId(oscar.getId()).build());

        // =============================================
        // SUIVI DU POIDS (40+ enregistrements)
        // =============================================

        // Rex (6 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(30.0).date(LocalDate.now().minusDays(300)).notes("Poids a l'adoption").animalId(rex.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(31.5).date(LocalDate.now().minusDays(240)).animalId(rex.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(32.8).date(LocalDate.now().minusDays(180)).animalId(rex.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(33.2).date(LocalDate.now().minusDays(120)).animalId(rex.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(33.8).date(LocalDate.now().minusDays(60)).animalId(rex.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(34.0).date(LocalDate.now().minusDays(5)).notes("Poids stable, bon etat").animalId(rex.getId()).build());

        // Mimi (5 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(3.5).date(LocalDate.now().minusDays(250)).animalId(mimi.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(3.9).date(LocalDate.now().minusDays(180)).notes("Avant sterilisation").animalId(mimi.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(4.2).date(LocalDate.now().minusDays(120)).notes("Apres sterilisation, prise normale").animalId(mimi.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(4.4).date(LocalDate.now().minusDays(60)).animalId(mimi.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(4.5).date(LocalDate.now().minusDays(5)).animalId(mimi.getId()).build());

        // Sultan (5 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(22.0).date(LocalDate.now().minusDays(300)).animalId(sultan.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(23.5).date(LocalDate.now().minusDays(200)).animalId(sultan.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(24.2).date(LocalDate.now().minusDays(120)).animalId(sultan.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(24.8).date(LocalDate.now().minusDays(60)).animalId(sultan.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(25.0).date(LocalDate.now().minusDays(3)).notes("Poids ideal pour Sloughi").animalId(sultan.getId()).build());

        // Bella (4 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(4.5).date(LocalDate.now().minusDays(200)).animalId(bella.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(4.8).date(LocalDate.now().minusDays(120)).animalId(bella.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(5.0).date(LocalDate.now().minusDays(60)).animalId(bella.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(5.2).date(LocalDate.now().minusDays(4)).animalId(bella.getId()).build());

        // Rocky (4 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(25.0).date(LocalDate.now().minusDays(180)).animalId(rocky.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(26.5).date(LocalDate.now().minusDays(120)).animalId(rocky.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(27.2).date(LocalDate.now().minusDays(60)).animalId(rocky.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(28.0).date(LocalDate.now().minusDays(6)).animalId(rocky.getId()).build());

        // Luna (3 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(3.0).date(LocalDate.now().minusDays(200)).notes("A l'adoption").animalId(luna.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(3.5).date(LocalDate.now().minusDays(100)).animalId(luna.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(3.8).date(LocalDate.now().minusDays(8)).animalId(luna.getId()).build());

        // Princesse (4 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(4.2).date(LocalDate.now().minusDays(200)).animalId(princesse.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(4.5).date(LocalDate.now().minusDays(120)).animalId(princesse.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(4.6).date(LocalDate.now().minusDays(60)).animalId(princesse.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(4.8).date(LocalDate.now().minusDays(2)).animalId(princesse.getId()).build());

        // Simba (3 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(5.0).date(LocalDate.now().minusDays(120)).animalId(simba.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(6.0).date(LocalDate.now().minusDays(60)).animalId(simba.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(6.5).date(LocalDate.now().minusDays(9)).animalId(simba.getId()).build());

        // Balto (5 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(21.0).date(LocalDate.now().minusDays(300)).animalId(balto.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(22.0).date(LocalDate.now().minusDays(200)).animalId(balto.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(22.8).date(LocalDate.now().minusDays(120)).animalId(balto.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(23.2).date(LocalDate.now().minusDays(60)).animalId(balto.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(23.5).date(LocalDate.now().minusDays(1)).notes("Poids stable malgre la chaleur").animalId(balto.getId()).build());

        // Caramel (3 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(5.0).date(LocalDate.now().minusDays(150)).animalId(caramel.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(5.5).date(LocalDate.now().minusDays(60)).notes("Un peu en surpoids").animalId(caramel.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(5.8).date(LocalDate.now().minusDays(3)).notes("Regime conseille").animalId(caramel.getId()).build());

        // Max - Demo (5 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(28.0).date(LocalDate.now().minusDays(300)).animalId(max.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(30.0).date(LocalDate.now().minusDays(200)).animalId(max.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(31.5).date(LocalDate.now().minusDays(120)).animalId(max.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(32.0).date(LocalDate.now().minusDays(60)).animalId(max.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(32.5).date(LocalDate.now().minusDays(1)).notes("Poids ideal").animalId(max.getId()).build());

        // Minette - Demo (4 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(3.2).date(LocalDate.now().minusDays(250)).notes("A l'adoption pres de la Medina").animalId(minette.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(3.5).date(LocalDate.now().minusDays(150)).animalId(minette.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(3.8).date(LocalDate.now().minusDays(60)).animalId(minette.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(4.0).date(LocalDate.now().minusDays(5)).animalId(minette.getId()).build());

        // Neige (3 entrees)
        weightRecordRepository.save(WeightRecord.builder().weight(1.2).date(LocalDate.now().minusDays(150)).notes("Jeune lapin").animalId(neige.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(1.6).date(LocalDate.now().minusDays(60)).animalId(neige.getId()).build());
        weightRecordRepository.save(WeightRecord.builder().weight(1.9).date(LocalDate.now().minusDays(3)).animalId(neige.getId()).build());

        System.out.println("=== Donnees de demonstration initialisees (contexte Tunis) ===");
        System.out.println("7 utilisateurs | 18 animaux | 20+ dossiers medicaux");
        System.out.println("27 vaccinations | 15 rendez-vous | 15 rappels | 24 repas | 55 pesees");
        System.out.println("=== Comptes ===");
        System.out.println("Demo:     demo@petcare.tn / demo1234");
        System.out.println("Amine:    amine@petcare.tn / amine1234");
        System.out.println("Yasmine:  yasmine@petcare.tn / yasmine1234");
        System.out.println("Khalil:   khalil@petcare.tn / khalil1234");
        System.out.println("Fatma:    fatma@petcare.tn / fatma1234");
        System.out.println("Ahmed:    ahmed@petcare.tn / ahmed1234");
        System.out.println("Vet:      vet@petcare.tn / vet1234");
        System.out.println("============================================");
    }
}
