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

function createSeedData(): DB {
  const today = new Date().toISOString().split("T")[0];

  const users: StoredUser[] = [
    { id: DEMO_USER_ID, email: "demo@petcare.fr", password: "demo1234", firstName: "Sophie", lastName: "Martin", role: "owner", createdAt: daysAgo(90) + "T10:00:00Z" },
    { id: VET_USER_ID, email: "vet@petcare.fr", password: "vet1234", firstName: "Jean", lastName: "Dupont", role: "veterinarian", createdAt: daysAgo(120) + "T08:00:00Z" },
  ];

  const animals: Animal[] = [
    { id: "animal_001", name: "Luna", species: "cat", breed: "Siamois", birthDate: "2022-03-15", gender: "female", color: "Creme et chocolat", weight: 4.2, microchipNumber: "250269812345678", notes: "Tres joueuse. Allergique au poulet.", ownerId: DEMO_USER_ID, createdAt: daysAgo(80) + "T10:00:00Z", updatedAt: daysAgo(2) + "T14:00:00Z" },
    { id: "animal_002", name: "Rex", species: "dog", breed: "Berger Allemand", birthDate: "2021-07-20", gender: "male", color: "Noir et feu", weight: 32.5, microchipNumber: "250269887654321", notes: "Tres protecteur, regime hypoallergenique.", ownerId: DEMO_USER_ID, createdAt: daysAgo(75) + "T11:00:00Z", updatedAt: daysAgo(5) + "T09:00:00Z" },
    { id: "animal_003", name: "Kiwi", species: "bird", breed: "Canari", birthDate: "2023-01-10", gender: "male", color: "Jaune vif", weight: 0.025, notes: "Chante le matin.", ownerId: DEMO_USER_ID, createdAt: daysAgo(60) + "T15:00:00Z", updatedAt: daysAgo(10) + "T16:00:00Z" },
    { id: "animal_004", name: "Noisette", species: "rabbit", breed: "Nain Belier", birthDate: "2023-06-05", gender: "female", color: "Brun et blanc", weight: 1.8, notes: "Adore les carottes.", ownerId: DEMO_USER_ID, createdAt: daysAgo(45) + "T12:00:00Z", updatedAt: daysAgo(3) + "T10:00:00Z" },
  ];

  const medicalRecords: MedicalRecord[] = [
    { id: "med_001", animalId: "animal_001", type: "consultation", title: "Bilan annuel", description: "Examen complet. RAS.", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysAgo(15), notes: "Prochain bilan dans 12 mois", createdAt: daysAgo(15) + "T10:30:00Z" },
    { id: "med_002", animalId: "animal_001", type: "treatment", title: "Traitement anti-puces", description: "Application de Frontline Combo.", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysAgo(45), createdAt: daysAgo(45) + "T11:00:00Z" },
    { id: "med_003", animalId: "animal_002", type: "consultation", title: "Boiterie patte arriere droite", description: "Entorse legere. Repos 5 jours.", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysAgo(10), createdAt: daysAgo(10) + "T14:00:00Z" },
    { id: "med_004", animalId: "animal_002", type: "exam", title: "Radio hanche", description: "Pas de dysplasie.", veterinarian: "Dr. Marie Lambert", clinic: "Clinique VetCare", date: daysAgo(60), createdAt: daysAgo(60) + "T09:30:00Z" },
    { id: "med_005", animalId: "animal_002", type: "surgery", title: "Detartrage", description: "Detartrage sous AG. 2 dents extraites.", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysAgo(90), createdAt: daysAgo(90) + "T08:00:00Z" },
  ];

  const vaccinations: Vaccination[] = [
    { id: "vacc_001", animalId: "animal_001", name: "Typhus", date: daysAgo(15), nextDueDate: daysFromNow(350), veterinarian: "Dr. Jean Dupont", batchNumber: "FEL-2024-8832", status: "up_to_date", createdAt: daysAgo(15) + "T10:45:00Z" },
    { id: "vacc_002", animalId: "animal_001", name: "Coryza", date: daysAgo(15), nextDueDate: daysFromNow(350), veterinarian: "Dr. Jean Dupont", batchNumber: "COR-2024-4451", status: "up_to_date", createdAt: daysAgo(15) + "T10:45:00Z" },
    { id: "vacc_003", animalId: "animal_001", name: "Leucose feline (FeLV)", date: daysAgo(200), nextDueDate: daysAgo(5), veterinarian: "Dr. Jean Dupont", batchNumber: "FLV-2023-1120", status: "overdue", createdAt: daysAgo(200) + "T11:00:00Z" },
    { id: "vacc_004", animalId: "animal_002", name: "Rage", date: daysAgo(30), nextDueDate: daysFromNow(335), veterinarian: "Dr. Jean Dupont", batchNumber: "RAB-2024-7721", status: "up_to_date", createdAt: daysAgo(30) + "T09:00:00Z" },
    { id: "vacc_005", animalId: "animal_002", name: "DHPP", date: daysAgo(30), nextDueDate: daysFromNow(335), veterinarian: "Dr. Jean Dupont", batchNumber: "DHP-2024-3305", status: "up_to_date", createdAt: daysAgo(30) + "T09:15:00Z" },
    { id: "vacc_006", animalId: "animal_002", name: "Leptospirose", date: daysAgo(180), nextDueDate: daysFromNow(10), veterinarian: "Dr. Jean Dupont", batchNumber: "LEP-2024-0092", status: "due_soon", createdAt: daysAgo(180) + "T10:00:00Z" },
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
    { id: "appt_001", animalId: "animal_001", animalName: "Luna", title: "Rappel vaccin Leucose", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysFromNow(5), time: "10:00", status: "scheduled", ownerId: DEMO_USER_ID, createdAt: daysAgo(2) + "T14:00:00Z" },
    { id: "appt_002", animalId: "animal_002", animalName: "Rex", title: "Controle boiterie", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysFromNow(3), time: "14:30", status: "scheduled", ownerId: DEMO_USER_ID, createdAt: daysAgo(5) + "T10:00:00Z" },
    { id: "appt_003", animalId: "animal_001", animalName: "Luna", title: "Bilan annuel", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysAgo(15), time: "10:30", status: "completed", ownerId: DEMO_USER_ID, createdAt: daysAgo(30) + "T09:00:00Z" },
  ];

  const reminders: Reminder[] = [
    { id: "rem_001", animalId: "animal_001", animalName: "Luna", title: "Traitement anti-puces", description: "Appliquer Frontline Combo", type: "medication", date: daysFromNow(15), time: "10:00", recurrence: "monthly", isActive: true, createdAt: daysAgo(10) + "T08:00:00Z" },
    { id: "rem_002", animalId: "animal_002", animalName: "Rex", title: "Vermifuge trimestriel", description: "Donner 1 comprime Milbemax", type: "medication", date: daysFromNow(20), time: "08:00", recurrence: "monthly", isActive: true, createdAt: daysAgo(5) + "T09:00:00Z" },
    { id: "rem_003", animalId: "animal_002", animalName: "Rex", title: "Toilettage", description: "Bain et brossage", type: "grooming", date: daysFromNow(7), time: "14:00", recurrence: "monthly", isActive: true, createdAt: daysAgo(3) + "T10:00:00Z" },
    { id: "rem_004", animalId: "animal_003", animalName: "Kiwi", title: "Nettoyage cage", description: "Nettoyage complet", type: "grooming", date: daysFromNow(2), time: "09:00", recurrence: "weekly", isActive: true, createdAt: daysAgo(7) + "T08:00:00Z" },
    { id: "rem_005", animalId: "animal_001", animalName: "Luna", title: "Rappel vaccin Leucose", description: "Vaccin FeLV en retard", type: "vaccination", date: today, time: "09:00", recurrence: "none", isActive: true, createdAt: daysAgo(5) + "T11:00:00Z" },
  ];

  const vetProfiles: VetProfile[] = [
    { id: "vp_001", userId: VET_USER_ID, name: "Dr. Jean Dupont", specialty: "Generaliste", clinic: "Clinique VetCare", address: "12 rue des Animaux, 75001 Paris", phone: "01 23 45 67 89", availableDays: [1, 2, 3, 4, 5], slotDuration: 30, workStart: "09:00", workEnd: "18:00" },
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
