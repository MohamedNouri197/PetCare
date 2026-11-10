/**
 * Server-side in-memory database for Next.js Server Actions & API Routes.
 * Replaces Spring Boot + MongoDB.
 * Data persists as long as the Next.js process runs.
 */

import type { User, Animal, MedicalRecord, Vaccination, Meal, WeightEntry, Appointment, Reminder, VetSlot, VetProfile } from "@/types";

interface StoredUser extends User {
  password: string;
}

interface DB {
  users: StoredUser[];
  animals: Animal[];
  medicalRecords: MedicalRecord[];
  vaccinations: Vaccination[];
  meals: Meal[];
  weightEntries: WeightEntry[];
  appointments: Appointment[];
  reminders: Reminder[];
  vetSlots: VetSlot[];
  vetProfiles: VetProfile[];
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

const DEMO_USER_ID = "demo_owner_001";
const VET_USER_ID = "demo_vet_001";
const AMINE_USER_ID = "user_amine_001";
const YASMINE_USER_ID = "user_yasmine_001";
const KHALIL_USER_ID = "user_khalil_001";
const FATMA_USER_ID = "user_fatma_001";
const AHMED_USER_ID = "user_ahmed_001";

function createSeedData(): DB {
  const today = new Date().toISOString().split("T")[0];

  const users: StoredUser[] = [
    { id: DEMO_USER_ID, email: "demo@petcare.tn", password: "demo1234", firstName: "Demo", lastName: "Utilisateur", role: "owner", createdAt: daysAgo(150) + "T10:00:00Z" },
    { id: VET_USER_ID, email: "vet@petcare.tn", password: "vet1234", firstName: "Dr. Sami", lastName: "Khelifi", role: "veterinarian", createdAt: daysAgo(200) + "T08:00:00Z" },
    { id: AMINE_USER_ID, email: "amine@petcare.tn", password: "amine1234", firstName: "Mohamed Amine", lastName: "Nouri", role: "owner", createdAt: daysAgo(120) + "T10:00:00Z" },
    { id: YASMINE_USER_ID, email: "yasmine@petcare.tn", password: "yasmine1234", firstName: "Yasmine", lastName: "Ben Ali", role: "owner", createdAt: daysAgo(90) + "T10:00:00Z" },
    { id: KHALIL_USER_ID, email: "khalil@petcare.tn", password: "khalil1234", firstName: "Khalil", lastName: "Trabelsi", role: "owner", createdAt: daysAgo(60) + "T10:00:00Z" },
    { id: FATMA_USER_ID, email: "fatma@petcare.tn", password: "fatma1234", firstName: "Fatma", lastName: "Bouazizi", role: "owner", createdAt: daysAgo(45) + "T10:00:00Z" },
    { id: AHMED_USER_ID, email: "ahmed@petcare.tn", password: "ahmed1234", firstName: "Ahmed", lastName: "Mejri", role: "owner", createdAt: daysAgo(30) + "T10:00:00Z" },
  ];

  const animals: Animal[] = [
    // Demo user animals
    { id: "animal_001", name: "Max", species: "dog", breed: "Golden Retriever", birthDate: "2021-03-15", gender: "male", color: "Dore", weight: 32.5, microchipNumber: "788269800123456", notes: "Tres joueur, promenades au Parc du Belvedere chaque matin.", ownerId: DEMO_USER_ID, createdAt: daysAgo(140) + "T10:00:00Z", updatedAt: daysAgo(1) + "T14:00:00Z" },
    { id: "animal_002", name: "Minette", species: "cat", breed: "Europeen", birthDate: "2022-06-20", gender: "female", color: "Ecaille de tortue", weight: 4.0, microchipNumber: "788269800123457", notes: "Trouvee pres de la Medina de Tunis, tres affectueuse.", ownerId: DEMO_USER_ID, createdAt: daysAgo(130) + "T11:00:00Z", updatedAt: daysAgo(5) + "T09:00:00Z" },
    { id: "animal_003", name: "Pirate", species: "bird", breed: "Calopsitte elegante", birthDate: "2023-09-01", gender: "male", color: "Gris avec joues orange", weight: 0.09, notes: "Siffle des melodies, tres sociable.", ownerId: DEMO_USER_ID, createdAt: daysAgo(100) + "T15:00:00Z", updatedAt: daysAgo(14) + "T16:00:00Z" },
    // Amine animals
    { id: "animal_004", name: "Rex", species: "dog", breed: "Berger Allemand", birthDate: "2021-05-10", gender: "male", color: "Noir et feu", weight: 34.0, microchipNumber: "788269801234567", notes: "Tres protecteur, garde la maison a La Marsa.", ownerId: AMINE_USER_ID, createdAt: daysAgo(100) + "T10:00:00Z", updatedAt: daysAgo(2) + "T14:00:00Z" },
    { id: "animal_005", name: "Mimi", species: "cat", breed: "Siamois", birthDate: "2022-08-15", gender: "female", color: "Creme et chocolat", weight: 4.5, microchipNumber: "788269801234568", notes: "Tres caline, allergique au poulet.", ownerId: AMINE_USER_ID, createdAt: daysAgo(95) + "T11:00:00Z", updatedAt: daysAgo(5) + "T09:00:00Z" },
    { id: "animal_006", name: "Coco", species: "bird", breed: "Perruche ondulee", birthDate: "2023-03-20", gender: "male", color: "Vert et jaune", weight: 0.035, notes: "Chante le matin, aime les graines de tournesol.", ownerId: AMINE_USER_ID, createdAt: daysAgo(80) + "T15:00:00Z", updatedAt: daysAgo(10) + "T16:00:00Z" },
    { id: "animal_007", name: "Neige", species: "rabbit", breed: "Nain Belier", birthDate: "2023-11-05", gender: "female", color: "Blanc", weight: 1.9, notes: "Adore les carottes et le persil frais du marche central.", ownerId: AMINE_USER_ID, createdAt: daysAgo(60) + "T12:00:00Z", updatedAt: daysAgo(3) + "T10:00:00Z" },
    // Yasmine animals
    { id: "animal_008", name: "Sultan", species: "dog", breed: "Sloughi", birthDate: "2020-02-14", gender: "male", color: "Sable dore", weight: 25.0, microchipNumber: "788269802345678", notes: "Race tunisienne, tres rapide, promenades a Sidi Bou Said.", ownerId: YASMINE_USER_ID, createdAt: daysAgo(85) + "T10:00:00Z", updatedAt: daysAgo(1) + "T14:00:00Z" },
    { id: "animal_009", name: "Bella", species: "cat", breed: "Angora Turc", birthDate: "2021-12-01", gender: "female", color: "Blanc pur", weight: 5.2, microchipNumber: "788269802345679", notes: "Poils longs, necessite un brossage quotidien.", ownerId: YASMINE_USER_ID, createdAt: daysAgo(80) + "T11:00:00Z", updatedAt: daysAgo(4) + "T09:00:00Z" },
    { id: "animal_010", name: "Oscar", species: "hamster", breed: "Hamster dore", birthDate: "2024-06-10", gender: "male", color: "Dore et blanc", weight: 0.12, notes: "Tres actif la nuit, adore sa roue.", ownerId: YASMINE_USER_ID, createdAt: daysAgo(50) + "T15:00:00Z", updatedAt: daysAgo(7) + "T16:00:00Z" },
    // Khalil animals
    { id: "animal_011", name: "Rocky", species: "dog", breed: "Pitbull", birthDate: "2022-01-08", gender: "male", color: "Bringe", weight: 28.0, microchipNumber: "788269803456789", notes: "Doux malgre les apparences, adore les enfants.", ownerId: KHALIL_USER_ID, createdAt: daysAgo(55) + "T10:00:00Z", updatedAt: daysAgo(6) + "T14:00:00Z" },
    { id: "animal_012", name: "Luna", species: "cat", breed: "Chat de gouttiere", birthDate: "2023-04-17", gender: "female", color: "Tigree gris", weight: 3.8, notes: "Trouvee dans le quartier El Menzah, adoptee a 2 mois.", ownerId: KHALIL_USER_ID, createdAt: daysAgo(50) + "T11:00:00Z", updatedAt: daysAgo(8) + "T09:00:00Z" },
    { id: "animal_013", name: "Nemo", species: "fish", breed: "Poisson-clown", birthDate: "2024-02-01", gender: "male", color: "Orange et blanc", weight: 0.02, notes: "Aquarium 100L dans le salon.", ownerId: KHALIL_USER_ID, createdAt: daysAgo(40) + "T15:00:00Z", updatedAt: daysAgo(15) + "T16:00:00Z" },
    // Fatma animals
    { id: "animal_014", name: "Princesse", species: "cat", breed: "Persan", birthDate: "2021-09-22", gender: "female", color: "Gris cendre", weight: 4.8, microchipNumber: "788269804567890", notes: "Nez ecrase, necessite nettoyage des yeux regulier.", ownerId: FATMA_USER_ID, createdAt: daysAgo(40) + "T10:00:00Z", updatedAt: daysAgo(2) + "T14:00:00Z" },
    { id: "animal_015", name: "Simba", species: "dog", breed: "Caniche", birthDate: "2023-07-30", gender: "male", color: "Abricot", weight: 6.5, microchipNumber: "788269804567891", notes: "Toilettage tous les 2 mois chez Salon Vetcare Lac.", ownerId: FATMA_USER_ID, createdAt: daysAgo(35) + "T11:00:00Z", updatedAt: daysAgo(9) + "T09:00:00Z" },
    // Ahmed animals
    { id: "animal_016", name: "Balto", species: "dog", breed: "Husky Siberien", birthDate: "2022-11-11", gender: "male", color: "Gris et blanc", weight: 23.5, microchipNumber: "788269805678901", notes: "Supporte mal la chaleur de Tunis en ete, climatisation obligatoire.", ownerId: AHMED_USER_ID, createdAt: daysAgo(28) + "T10:00:00Z", updatedAt: daysAgo(1) + "T14:00:00Z" },
    { id: "animal_017", name: "Caramel", species: "cat", breed: "British Shorthair", birthDate: "2023-05-05", gender: "male", color: "Bleu (gris)", weight: 5.8, microchipNumber: "788269805678902", notes: "Achete a l'animalerie de la Soukra, tres gourmand.", ownerId: AHMED_USER_ID, createdAt: daysAgo(25) + "T11:00:00Z", updatedAt: daysAgo(3) + "T09:00:00Z" },
    { id: "animal_018", name: "Drago", species: "reptile", breed: "Iguane vert", birthDate: "2024-01-15", gender: "male", color: "Vert emeraude", weight: 0.45, notes: "Terrarium chauffe, alimentation vegetale uniquement.", ownerId: AHMED_USER_ID, createdAt: daysAgo(20) + "T15:00:00Z", updatedAt: daysAgo(12) + "T16:00:00Z" },
  ];

  const medicalRecords: MedicalRecord[] = [
    { id: "med_001", animalId: "animal_001", type: "consultation", title: "Visite annuelle", description: "Bilan complet. Poids stable. Dentition en bon etat.", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysAgo(20), notes: "Prochain bilan dans 12 mois", createdAt: daysAgo(20) + "T10:30:00Z" },
    { id: "med_002", animalId: "animal_001", type: "treatment", title: "Traitement anti-puces", description: "Application Bravecto comprime. Protection 3 mois.", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysAgo(20), createdAt: daysAgo(20) + "T11:00:00Z" },
    { id: "med_003", animalId: "animal_001", type: "surgery", title: "Extraction dentaire", description: "Extraction d'une premolaire fracturee sous anesthesie generale.", veterinarian: "Dr. Leila Hammami", clinic: "Centre Veterinaire Lac 2, Tunis", date: daysAgo(200), createdAt: daysAgo(200) + "T09:30:00Z" },
    { id: "med_004", animalId: "animal_002", type: "consultation", title: "Gastro-enterite", description: "Vomissements et diarrhee. Anti-emetique + diete 24h.", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysAgo(45), createdAt: daysAgo(45) + "T14:00:00Z" },
    { id: "med_005", animalId: "animal_004", type: "consultation", title: "Bilan annuel complet", description: "Examen general, auscultation. RAS.", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysAgo(30), notes: "Animal en bonne sante", createdAt: daysAgo(30) + "T10:00:00Z" },
    { id: "med_006", animalId: "animal_004", type: "exam", title: "Radiographie hanche", description: "Controle de dysplasie. Resultats normaux.", veterinarian: "Dr. Leila Hammami", clinic: "Centre Veterinaire Lac 2, Tunis", date: daysAgo(120), createdAt: daysAgo(120) + "T09:30:00Z" },
    { id: "med_007", animalId: "animal_005", type: "surgery", title: "Sterilisation", description: "Ovariectomie sous AG. Intervention sans complication.", veterinarian: "Dr. Leila Hammami", clinic: "Centre Veterinaire Lac 2, Tunis", date: daysAgo(180), createdAt: daysAgo(180) + "T08:00:00Z" },
    { id: "med_008", animalId: "animal_005", type: "consultation", title: "Allergie cutanee", description: "Demangeaisons au cou. Prescrit antihistaminique.", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysAgo(20), createdAt: daysAgo(20) + "T10:30:00Z" },
    { id: "med_009", animalId: "animal_008", type: "consultation", title: "Boiterie patte avant", description: "Entorse du carpe apres course a Gammarth. Repos 7 jours.", veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", date: daysAgo(15), createdAt: daysAgo(15) + "T14:00:00Z" },
    { id: "med_010", animalId: "animal_011", type: "treatment", title: "Otite externe", description: "Nettoyage auriculaire + traitement topique.", veterinarian: "Dr. Imen Gharbi", clinic: "Clinique Veterinaire El Menzah, Tunis", date: daysAgo(45), createdAt: daysAgo(45) + "T11:00:00Z" },
    { id: "med_011", animalId: "animal_014", type: "consultation", title: "Probleme respiratoire", description: "Difficulte respiratoire liee au nez ecrase (brachycephale).", veterinarian: "Dr. Anis Mathlouthi", clinic: "Clinique Les Berges du Lac, Tunis", date: daysAgo(18), createdAt: daysAgo(18) + "T10:00:00Z" },
    { id: "med_012", animalId: "animal_016", type: "consultation", title: "Coup de chaleur", description: "Episode en aout. Rehydratation IV. Surveillance 24h.", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysAgo(80), notes: "Limiter les sorties entre 11h et 17h en ete", createdAt: daysAgo(80) + "T14:00:00Z" },
  ];

  const vaccinations: Vaccination[] = [
    // Max - Demo
    { id: "vacc_001", animalId: "animal_001", name: "Rage", date: daysAgo(20), nextDueDate: daysFromNow(345), veterinarian: "Dr. Sami Khelifi", batchNumber: "RAB-2026-TN-1301", status: "up_to_date", createdAt: daysAgo(20) + "T09:00:00Z" },
    { id: "vacc_002", animalId: "animal_001", name: "DHPP", date: daysAgo(20), nextDueDate: daysFromNow(345), veterinarian: "Dr. Sami Khelifi", batchNumber: "DHP-2026-TN-1155", status: "up_to_date", createdAt: daysAgo(20) + "T09:15:00Z" },
    { id: "vacc_003", animalId: "animal_001", name: "Leptospirose", date: daysAgo(20), nextDueDate: daysFromNow(345), veterinarian: "Dr. Sami Khelifi", batchNumber: "LEP-2026-TN-0489", status: "up_to_date", createdAt: daysAgo(20) + "T09:30:00Z" },
    // Minette - Demo
    { id: "vacc_004", animalId: "animal_002", name: "Typhus", date: daysAgo(60), nextDueDate: daysFromNow(305), veterinarian: "Dr. Sami Khelifi", batchNumber: "TYP-2026-TN-0998", status: "up_to_date", createdAt: daysAgo(60) + "T10:00:00Z" },
    { id: "vacc_005", animalId: "animal_002", name: "Coryza", date: daysAgo(60), nextDueDate: daysFromNow(305), veterinarian: "Dr. Sami Khelifi", batchNumber: "COR-2026-TN-1002", status: "up_to_date", createdAt: daysAgo(60) + "T10:15:00Z" },
    // Rex - Amine
    { id: "vacc_006", animalId: "animal_004", name: "Rage", date: daysAgo(30), nextDueDate: daysFromNow(335), veterinarian: "Dr. Sami Khelifi", batchNumber: "RAB-2026-TN-0891", status: "up_to_date", createdAt: daysAgo(30) + "T09:00:00Z" },
    { id: "vacc_007", animalId: "animal_004", name: "DHPP", date: daysAgo(30), nextDueDate: daysFromNow(335), veterinarian: "Dr. Sami Khelifi", batchNumber: "DHP-2026-TN-1204", status: "up_to_date", createdAt: daysAgo(30) + "T09:15:00Z" },
    { id: "vacc_008", animalId: "animal_004", name: "Leptospirose", date: daysAgo(180), nextDueDate: daysFromNow(10), veterinarian: "Dr. Sami Khelifi", batchNumber: "LEP-2026-TN-0332", status: "due_soon", createdAt: daysAgo(180) + "T10:00:00Z" },
    // Mimi - Amine
    { id: "vacc_009", animalId: "animal_005", name: "Typhus", date: daysAgo(45), nextDueDate: daysFromNow(320), veterinarian: "Dr. Sami Khelifi", batchNumber: "TYP-2026-TN-0556", status: "up_to_date", createdAt: daysAgo(45) + "T10:00:00Z" },
    { id: "vacc_010", animalId: "animal_005", name: "Leucose feline (FeLV)", date: daysAgo(200), nextDueDate: daysAgo(5), veterinarian: "Dr. Sami Khelifi", batchNumber: "FLV-2025-TN-0120", status: "overdue", createdAt: daysAgo(200) + "T11:00:00Z" },
    // Sultan - Yasmine
    { id: "vacc_011", animalId: "animal_008", name: "Rage", date: daysAgo(60), nextDueDate: daysFromNow(305), veterinarian: "Dr. Nabil Saidi", batchNumber: "RAB-2026-TN-0445", status: "up_to_date", createdAt: daysAgo(60) + "T09:00:00Z" },
    { id: "vacc_012", animalId: "animal_008", name: "Leishmaniose", date: daysAgo(60), nextDueDate: daysFromNow(305), veterinarian: "Dr. Nabil Saidi", batchNumber: "LEI-2026-TN-0102", status: "up_to_date", createdAt: daysAgo(60) + "T09:30:00Z" },
    // Rocky - Khalil
    { id: "vacc_013", animalId: "animal_011", name: "Rage", date: daysAgo(25), nextDueDate: daysFromNow(340), veterinarian: "Dr. Imen Gharbi", batchNumber: "RAB-2026-TN-1102", status: "up_to_date", createdAt: daysAgo(25) + "T09:00:00Z" },
    // Balto - Ahmed
    { id: "vacc_014", animalId: "animal_016", name: "Rage", date: daysAgo(40), nextDueDate: daysFromNow(325), veterinarian: "Dr. Sami Khelifi", batchNumber: "RAB-2026-TN-0712", status: "up_to_date", createdAt: daysAgo(40) + "T09:00:00Z" },
    { id: "vacc_015", animalId: "animal_016", name: "Piroplasmose", date: daysAgo(150), nextDueDate: daysFromNow(30), veterinarian: "Dr. Sami Khelifi", batchNumber: "PIR-2026-TN-0055", status: "due_soon", createdAt: daysAgo(150) + "T10:00:00Z" },
  ];

  const meals: Meal[] = [
    { id: "meal_001", animalId: "animal_001", type: "breakfast", foodName: "Royal Canin Siamese", quantity: "50", unit: "g", time: "07:30", createdAt: today + "T07:30:00Z" },
    { id: "meal_002", animalId: "animal_001", type: "dinner", foodName: "Royal Canin Siamese", quantity: "50", unit: "g", time: "18:00", createdAt: today + "T18:00:00Z" },
    { id: "meal_003", animalId: "animal_002", type: "breakfast", foodName: "Pro Plan Large Athletic", quantity: "200", unit: "g", time: "07:00", createdAt: today + "T07:00:00Z" },
    { id: "meal_004", animalId: "animal_002", type: "dinner", foodName: "Pro Plan Large Athletic", quantity: "250", unit: "g", time: "18:30", createdAt: today + "T18:30:00Z" },
  ];

  const weightEntries: WeightEntry[] = [
    { id: "w_001", animalId: "animal_001", weight: 3.8, unit: "kg", date: daysAgo(120), createdAt: daysAgo(120) + "T10:00:00Z" },
    { id: "w_002", animalId: "animal_001", weight: 3.9, unit: "kg", date: daysAgo(90), createdAt: daysAgo(90) + "T10:00:00Z" },
    { id: "w_003", animalId: "animal_001", weight: 4.0, unit: "kg", date: daysAgo(60), createdAt: daysAgo(60) + "T10:00:00Z" },
    { id: "w_004", animalId: "animal_001", weight: 4.2, unit: "kg", date: daysAgo(5), createdAt: daysAgo(5) + "T10:00:00Z" },
    { id: "w_005", animalId: "animal_002", weight: 30.0, unit: "kg", date: daysAgo(150), createdAt: daysAgo(150) + "T09:00:00Z" },
    { id: "w_006", animalId: "animal_002", weight: 31.2, unit: "kg", date: daysAgo(120), createdAt: daysAgo(120) + "T09:00:00Z" },
    { id: "w_007", animalId: "animal_002", weight: 32.0, unit: "kg", date: daysAgo(60), createdAt: daysAgo(60) + "T09:00:00Z" },
    { id: "w_008", animalId: "animal_002", weight: 32.5, unit: "kg", date: daysAgo(3), createdAt: daysAgo(3) + "T09:00:00Z" },
    { id: "w_009", animalId: "animal_004", weight: 1.5, unit: "kg", date: daysAgo(60), createdAt: daysAgo(60) + "T12:00:00Z" },
    { id: "w_010", animalId: "animal_004", weight: 1.8, unit: "kg", date: daysAgo(3), createdAt: daysAgo(3) + "T12:00:00Z" },
  ];

  const appointments: Appointment[] = [
    { id: "appt_001", animalId: "animal_001", animalName: "Max", title: "Bilan annuel Max", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysFromNow(20), time: "10:00", status: "scheduled", ownerId: DEMO_USER_ID, createdAt: daysAgo(2) + "T14:00:00Z" },
    { id: "appt_002", animalId: "animal_004", animalName: "Rex", title: "Rappel Leptospirose Rex", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysFromNow(10), time: "10:00", status: "scheduled", ownerId: AMINE_USER_ID, createdAt: daysAgo(5) + "T10:00:00Z" },
    { id: "appt_003", animalId: "animal_005", animalName: "Mimi", title: "Rappel vaccin FeLV Mimi", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysFromNow(3), time: "14:30", status: "scheduled", ownerId: AMINE_USER_ID, createdAt: daysAgo(3) + "T09:00:00Z" },
    { id: "appt_004", animalId: "animal_008", animalName: "Sultan", title: "Controle boiterie Sultan", veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", date: daysFromNow(5), time: "11:00", status: "scheduled", ownerId: YASMINE_USER_ID, createdAt: daysAgo(4) + "T10:00:00Z" },
    { id: "appt_005", animalId: "animal_009", animalName: "Bella", title: "Toilettage Bella", veterinarian: "", clinic: "Salon Toilettage La Marsa", date: daysFromNow(7), time: "09:30", status: "scheduled", ownerId: YASMINE_USER_ID, createdAt: daysAgo(2) + "T11:00:00Z" },
    { id: "appt_006", animalId: "animal_011", animalName: "Rocky", title: "Controle otite Rocky", veterinarian: "Dr. Imen Gharbi", clinic: "Clinique Veterinaire El Menzah, Tunis", date: daysFromNow(2), time: "16:00", status: "scheduled", ownerId: KHALIL_USER_ID, createdAt: daysAgo(6) + "T14:00:00Z" },
    { id: "appt_007", animalId: "animal_014", animalName: "Princesse", title: "Bilan Princesse", veterinarian: "Dr. Anis Mathlouthi", clinic: "Clinique Les Berges du Lac, Tunis", date: daysFromNow(12), time: "10:30", status: "scheduled", ownerId: FATMA_USER_ID, createdAt: daysAgo(1) + "T09:00:00Z" },
    { id: "appt_008", animalId: "animal_016", animalName: "Balto", title: "Rappel Piroplasmose Balto", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysFromNow(15), time: "09:00", status: "scheduled", ownerId: AHMED_USER_ID, createdAt: daysAgo(3) + "T10:00:00Z" },
    // Passes
    { id: "appt_009", animalId: "animal_001", animalName: "Max", title: "Vaccination Max", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysAgo(20), time: "10:00", status: "completed", ownerId: DEMO_USER_ID, createdAt: daysAgo(30) + "T09:00:00Z" },
    { id: "appt_010", animalId: "animal_004", animalName: "Rex", title: "Bilan annuel Rex", veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", date: daysAgo(30), time: "10:00", status: "completed", ownerId: AMINE_USER_ID, createdAt: daysAgo(40) + "T09:00:00Z" },
  ];

  const reminders: Reminder[] = [
    { id: "rem_001", animalId: "animal_004", animalName: "Rex", title: "Anti-puces Rex", description: "Appliquer Frontline Combo", type: "medication", date: daysFromNow(15), time: "08:00", recurrence: "monthly", isActive: true, createdAt: daysAgo(10) + "T08:00:00Z" },
    { id: "rem_002", animalId: "animal_004", animalName: "Rex", title: "Vermifuge Rex", description: "Donner 1 comprime Milbemax", type: "medication", date: daysFromNow(25), time: "08:00", recurrence: "monthly", isActive: true, createdAt: daysAgo(5) + "T09:00:00Z" },
    { id: "rem_003", animalId: "animal_005", animalName: "Mimi", title: "Vaccin FeLV URGENT", description: "Rappel vaccin Leucose en retard !", type: "vaccination", date: today, time: "09:00", recurrence: "none", isActive: true, createdAt: daysAgo(5) + "T11:00:00Z" },
    { id: "rem_004", animalId: "animal_009", animalName: "Bella", title: "Brossage Bella", description: "Brossage quotidien poils longs", type: "grooming", date: daysFromNow(1), time: "18:00", recurrence: "daily", isActive: true, createdAt: daysAgo(3) + "T10:00:00Z" },
    { id: "rem_005", animalId: "animal_006", animalName: "Coco", title: "Cage Coco", description: "Nettoyage complet de la cage + graines fraiches", type: "grooming", date: daysFromNow(2), time: "09:00", recurrence: "weekly", isActive: true, createdAt: daysAgo(7) + "T08:00:00Z" },
    { id: "rem_006", animalId: "animal_014", animalName: "Princesse", title: "Nettoyage yeux Princesse", description: "Nettoyer les yeux avec serum physiologique", type: "grooming", date: daysFromNow(1), time: "09:00", recurrence: "daily", isActive: true, createdAt: daysAgo(4) + "T08:00:00Z" },
    { id: "rem_007", animalId: "animal_016", animalName: "Balto", title: "Climatisation Balto", description: "Verifier que la clim fonctionne - essentiel pour Husky a Tunis", type: "other", date: daysFromNow(1), time: "08:00", recurrence: "none", isActive: true, createdAt: daysAgo(2) + "T10:00:00Z" },
    { id: "rem_008", animalId: "animal_001", animalName: "Max", title: "Anti-puces Max", description: "Comprime Bravecto tous les 3 mois", type: "medication", date: daysFromNow(70), time: "08:00", recurrence: "monthly", isActive: true, createdAt: daysAgo(1) + "T09:00:00Z" },
    { id: "rem_009", animalId: "animal_013", animalName: "Nemo", title: "Nettoyage aquarium", description: "Changement partiel eau 20% + nettoyage filtre", type: "other", date: daysFromNow(3), time: "10:00", recurrence: "weekly", isActive: true, createdAt: daysAgo(6) + "T08:00:00Z" },
    { id: "rem_010", animalId: "animal_018", animalName: "Drago", title: "Nourriture Drago", description: "Preparer salade (laitue, courgette, carotte rapee)", type: "feeding", date: daysFromNow(1), time: "11:00", recurrence: "daily", isActive: true, createdAt: daysAgo(3) + "T08:00:00Z" },
  ];

  const vetProfiles: VetProfile[] = [
    { id: "vp_001", userId: VET_USER_ID, name: "Dr. Sami Khelifi", specialty: "Generaliste", clinic: "Clinique Veterinaire El Manar", address: "25 Avenue de la Liberte, El Manar, 2092 Tunis", phone: "71 234 567", availableDays: [1, 2, 3, 4, 5], slotDuration: 30, workStart: "09:00", workEnd: "18:00" },
  ];

  const vetSlots: VetSlot[] = [];
  const now = new Date();
  for (let d = -3; d < 14; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    if (![1, 2, 3, 4, 5].includes(date.getDay())) continue;
    const dateStr = date.toISOString().split("T")[0];
    for (let h = 9; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 17 && m === 30) continue;
        const eh = m + 30 >= 60 ? h + 1 : h;
        const em = (m + 30) % 60;
        vetSlots.push({
          id: `slot_${d}_${h}_${m}`,
          vetId: VET_USER_ID, vetName: "Dr. Jean Dupont", clinic: "Clinique VetCare",
          date: dateStr,
          startTime: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
          endTime: `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`,
          duration: 30, isBooked: d < 0 ? Math.random() < 0.5 : Math.random() < 0.15,
        });
      }
    }
  }

  return { users, animals, medicalRecords, vaccinations, meals, weightEntries, appointments, reminders, vetSlots, vetProfiles };
}

// Singleton: persists for the lifetime of the Next.js process
let database: DB | null = null;

export function getDB(): DB {
  if (!database) {
    database = createSeedData();
  }
  return database;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
