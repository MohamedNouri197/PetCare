import type { User, Animal, RegisterRequest, Appointment, VetSlot, VetProfile, MedicalRecord, Vaccination, Meal, WeightEntry, Reminder } from "@/types";

const STORE_KEYS = {
  users: "petcare_mock_users",
  animals: "petcare_mock_animals",
  appointments: "petcare_mock_appointments",
  vetSlots: "petcare_mock_vet_slots",
  vetProfiles: "petcare_mock_vet_profiles",
  medicalRecords: "petcare_mock_medical",
  vaccinations: "petcare_mock_vaccinations",
  meals: "petcare_mock_meals",
  weightEntries: "petcare_mock_weight",
  reminders: "petcare_mock_reminders",
  tracking: "petcare_mock_tracking",
  seeded: "petcare_demo_seeded",
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function getStore<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStore<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Auth ---

interface StoredUser extends User {
  password: string;
}

export function mockRegister(req: RegisterRequest): { token: string; user: User } {
  const users = getStore<StoredUser>(STORE_KEYS.users);
  if (users.find((u) => u.email === req.email)) {
    throw { message: "Cet email est deja utilise", status: 409 };
  }
  const newUser: StoredUser = {
    id: generateId(),
    email: req.email,
    password: req.password,
    firstName: req.firstName,
    lastName: req.lastName,
    role: req.role || "owner",
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  setStore(STORE_KEYS.users, users);
  const { password: _, ...user } = newUser;
  return { token: `mock_${user.id}_${Date.now()}`, user };
}

export function mockLogin(email: string, password: string): { token: string; user: User } {
  const users = getStore<StoredUser>(STORE_KEYS.users);
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) {
    throw { message: "Email ou mot de passe incorrect", status: 401 };
  }
  const { password: _, ...user } = found;
  return { token: `mock_${user.id}_${Date.now()}`, user };
}

// --- Animals ---

export function mockGetAnimals(userId: string): Animal[] {
  return getStore<Animal>(STORE_KEYS.animals).filter((a) => a.ownerId === userId);
}

export function mockGetAnimal(id: string): Animal {
  const animal = getStore<Animal>(STORE_KEYS.animals).find((a) => a.id === id);
  if (!animal) throw { message: "Animal non trouve", status: 404 };
  return animal;
}

export function mockCreateAnimal(data: Partial<Animal>, userId: string): Animal {
  const animals = getStore<Animal>(STORE_KEYS.animals);
  const newAnimal: Animal = {
    id: generateId(),
    name: data.name || "",
    species: data.species || "other",
    breed: data.breed || "",
    birthDate: data.birthDate || "",
    gender: data.gender || "male",
    color: data.color || "",
    weight: data.weight || 0,
    photoUrl: data.photoUrl,
    microchipNumber: data.microchipNumber,
    notes: data.notes,
    ownerId: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  animals.push(newAnimal);
  setStore(STORE_KEYS.animals, animals);
  return newAnimal;
}

export function mockUpdateAnimal(id: string, data: Partial<Animal>): Animal {
  const animals = getStore<Animal>(STORE_KEYS.animals);
  const index = animals.findIndex((a) => a.id === id);
  if (index === -1) throw { message: "Animal non trouve", status: 404 };
  animals[index] = { ...animals[index], ...data, updatedAt: new Date().toISOString() };
  setStore(STORE_KEYS.animals, animals);
  return animals[index];
}

export function mockDeleteAnimal(id: string): void {
  const animals = getStore<Animal>(STORE_KEYS.animals).filter((a) => a.id !== id);
  setStore(STORE_KEYS.animals, animals);
}

// --- Appointments ---

export function mockGetAppointments(userId?: string): Appointment[] {
  const appts = getStore<Appointment>(STORE_KEYS.appointments);
  if (!userId) return appts;
  return appts.filter((a) => a.ownerId === userId);
}

export function mockCreateAppointment(data: Partial<Appointment>, userId: string): Appointment {
  const appointments = getStore<Appointment>(STORE_KEYS.appointments);
  const animals = getStore<Animal>(STORE_KEYS.animals);
  const animal = animals.find((a) => a.id === data.animalId);
  const newAppt: Appointment = {
    id: generateId(),
    animalId: data.animalId || "",
    animalName: animal?.name || data.animalName || "",
    title: data.title || "",
    description: data.description,
    veterinarian: data.veterinarian || "",
    clinic: data.clinic || "",
    date: data.date || "",
    time: data.time || "",
    status: "scheduled",
    notes: data.notes,
    ownerId: userId,
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppt);
  setStore(STORE_KEYS.appointments, appointments);

  if (data.slotId) {
    const slots = getStore<VetSlot>(STORE_KEYS.vetSlots);
    const slotIdx = slots.findIndex((s) => s.id === data.slotId);
    if (slotIdx !== -1) {
      slots[slotIdx].isBooked = true;
      slots[slotIdx].bookedBy = userId;
      slots[slotIdx].appointmentId = newAppt.id;
      setStore(STORE_KEYS.vetSlots, slots);
    }
  }
  return newAppt;
}

export function mockDeleteAppointment(id: string): void {
  const appointments = getStore<Appointment>(STORE_KEYS.appointments);
  const appt = appointments.find((a) => a.id === id);
  if (appt) {
    const slots = getStore<VetSlot>(STORE_KEYS.vetSlots);
    const slotIdx = slots.findIndex((s) => s.appointmentId === id);
    if (slotIdx !== -1) {
      slots[slotIdx].isBooked = false;
      slots[slotIdx].bookedBy = undefined;
      slots[slotIdx].appointmentId = undefined;
      setStore(STORE_KEYS.vetSlots, slots);
    }
  }
  setStore(STORE_KEYS.appointments, appointments.filter((a) => a.id !== id));
}

// --- Vet Profiles ---

export function mockGetVetProfiles(): VetProfile[] {
  return getStore<VetProfile>(STORE_KEYS.vetProfiles);
}

export function mockGetVetProfile(userId: string): VetProfile | null {
  return getStore<VetProfile>(STORE_KEYS.vetProfiles).find((v) => v.userId === userId) || null;
}

export function mockSaveVetProfile(data: Partial<VetProfile>, userId: string): VetProfile {
  const profiles = getStore<VetProfile>(STORE_KEYS.vetProfiles);
  const existing = profiles.findIndex((p) => p.userId === userId);
  const profile: VetProfile = {
    id: existing !== -1 ? profiles[existing].id : generateId(),
    userId,
    name: data.name || "",
    specialty: data.specialty || "Generaliste",
    clinic: data.clinic || "",
    address: data.address || "",
    phone: data.phone || "",
    availableDays: data.availableDays || [1, 2, 3, 4, 5],
    slotDuration: data.slotDuration || 30,
    workStart: data.workStart || "09:00",
    workEnd: data.workEnd || "18:00",
  };
  if (existing !== -1) {
    profiles[existing] = profile;
  } else {
    profiles.push(profile);
  }
  setStore(STORE_KEYS.vetProfiles, profiles);
  return profile;
}

// --- Vet Slots ---

export function mockGetVetSlots(vetId?: string, date?: string): VetSlot[] {
  let slots = getStore<VetSlot>(STORE_KEYS.vetSlots);
  if (vetId) slots = slots.filter((s) => s.vetId === vetId);
  if (date) slots = slots.filter((s) => s.date === date);
  return slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function mockGenerateSlots(profile: VetProfile, date: string): VetSlot[] {
  const dayOfWeek = new Date(date).getDay();
  if (!profile.availableDays.includes(dayOfWeek)) return [];

  const existingSlots = getStore<VetSlot>(STORE_KEYS.vetSlots);
  const daySlots = existingSlots.filter((s) => s.vetId === profile.userId && s.date === date);
  if (daySlots.length > 0) return daySlots;

  const newSlots: VetSlot[] = [];
  const [startH, startM] = profile.workStart.split(":").map(Number);
  const [endH, endM] = profile.workEnd.split(":").map(Number);
  const startMin = startH * 60 + startM;
  const endMin = endH * 60 + endM;

  for (let min = startMin; min + profile.slotDuration <= endMin; min += profile.slotDuration) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    const eh = Math.floor((min + profile.slotDuration) / 60);
    const em = (min + profile.slotDuration) % 60;
    newSlots.push({
      id: generateId(),
      vetId: profile.userId,
      vetName: profile.name,
      clinic: profile.clinic,
      date,
      startTime: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      endTime: `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`,
      duration: profile.slotDuration,
      isBooked: false,
    });
  }

  existingSlots.push(...newSlots);
  setStore(STORE_KEYS.vetSlots, existingSlots);
  return newSlots;
}

export function mockToggleSlot(slotId: string): VetSlot {
  const slots = getStore<VetSlot>(STORE_KEYS.vetSlots);
  const idx = slots.findIndex((s) => s.id === slotId);
  if (idx === -1) throw { message: "Creneau non trouve", status: 404 };
  slots[idx].isBooked = !slots[idx].isBooked;
  if (!slots[idx].isBooked) {
    slots[idx].bookedBy = undefined;
    slots[idx].appointmentId = undefined;
  }
  setStore(STORE_KEYS.vetSlots, slots);
  return slots[idx];
}

export function mockDeleteSlot(slotId: string): void {
  const slots = getStore<VetSlot>(STORE_KEYS.vetSlots).filter((s) => s.id !== slotId);
  setStore(STORE_KEYS.vetSlots, slots);
}

// --- Medical Records ---

export function mockGetMedicalRecords(animalId: string): MedicalRecord[] {
  return getStore<MedicalRecord>(STORE_KEYS.medicalRecords)
    .filter((r) => r.animalId === animalId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function mockCreateMedicalRecord(animalId: string, data: Partial<MedicalRecord>): MedicalRecord {
  const records = getStore<MedicalRecord>(STORE_KEYS.medicalRecords);
  const record: MedicalRecord = {
    id: generateId(),
    animalId,
    type: data.type || "consultation",
    title: data.title || "",
    description: data.description || "",
    veterinarian: data.veterinarian || "",
    clinic: data.clinic || "",
    date: data.date || new Date().toISOString().split("T")[0],
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };
  records.push(record);
  setStore(STORE_KEYS.medicalRecords, records);
  return record;
}

// --- Vaccinations ---

export function mockGetVaccinations(animalId: string): Vaccination[] {
  return getStore<Vaccination>(STORE_KEYS.vaccinations)
    .filter((v) => v.animalId === animalId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function mockCreateVaccination(animalId: string, data: Partial<Vaccination>): Vaccination {
  const vaccinations = getStore<Vaccination>(STORE_KEYS.vaccinations);
  const vacc: Vaccination = {
    id: generateId(),
    animalId,
    name: data.name || "",
    date: data.date || new Date().toISOString().split("T")[0],
    nextDueDate: data.nextDueDate || "",
    veterinarian: data.veterinarian || "",
    batchNumber: data.batchNumber,
    status: data.status || "up_to_date",
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };
  vaccinations.push(vacc);
  setStore(STORE_KEYS.vaccinations, vaccinations);
  return vacc;
}

// --- Meals ---

export function mockGetMeals(animalId: string): Meal[] {
  return getStore<Meal>(STORE_KEYS.meals)
    .filter((m) => m.animalId === animalId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function mockCreateMeal(animalId: string, data: Partial<Meal>): Meal {
  const meals = getStore<Meal>(STORE_KEYS.meals);
  const meal: Meal = {
    id: generateId(),
    animalId,
    type: data.type || "breakfast",
    foodName: data.foodName || "",
    quantity: data.quantity || "",
    unit: data.unit || "g",
    time: data.time || "08:00",
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };
  meals.push(meal);
  setStore(STORE_KEYS.meals, meals);
  return meal;
}

export function mockDeleteMeal(animalId: string, mealId: string): void {
  const meals = getStore<Meal>(STORE_KEYS.meals).filter((m) => !(m.id === mealId && m.animalId === animalId));
  setStore(STORE_KEYS.meals, meals);
}

// --- Weight Entries ---

export function mockGetWeightEntries(animalId: string): WeightEntry[] {
  return getStore<WeightEntry>(STORE_KEYS.weightEntries)
    .filter((w) => w.animalId === animalId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function mockCreateWeightEntry(animalId: string, data: Partial<WeightEntry>): WeightEntry {
  const entries = getStore<WeightEntry>(STORE_KEYS.weightEntries);
  const entry: WeightEntry = {
    id: generateId(),
    animalId,
    weight: data.weight || 0,
    unit: data.unit || "kg",
    date: data.date || new Date().toISOString().split("T")[0],
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };
  entries.push(entry);
  setStore(STORE_KEYS.weightEntries, entries);
  return entry;
}

// --- Reminders ---

export function mockGetReminders(userId?: string): Reminder[] {
  return getStore<Reminder>(STORE_KEYS.reminders)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function mockCreateReminder(data: Partial<Reminder>): Reminder {
  const reminders = getStore<Reminder>(STORE_KEYS.reminders);
  const reminder: Reminder = {
    id: generateId(),
    animalId: data.animalId,
    animalName: data.animalName,
    title: data.title || "",
    description: data.description,
    type: data.type || "other",
    date: data.date || new Date().toISOString().split("T")[0],
    time: data.time,
    recurrence: data.recurrence || "none",
    isActive: data.isActive !== false,
    createdAt: new Date().toISOString(),
  };
  reminders.push(reminder);
  setStore(STORE_KEYS.reminders, reminders);
  return reminder;
}

export function mockUpdateReminder(id: string, data: Partial<Reminder>): Reminder {
  const reminders = getStore<Reminder>(STORE_KEYS.reminders);
  const idx = reminders.findIndex((r) => r.id === id);
  if (idx === -1) throw { message: "Rappel non trouve", status: 404 };
  reminders[idx] = { ...reminders[idx], ...data };
  setStore(STORE_KEYS.reminders, reminders);
  return reminders[idx];
}

export function mockDeleteReminder(id: string): void {
  const reminders = getStore<Reminder>(STORE_KEYS.reminders).filter((r) => r.id !== id);
  setStore(STORE_KEYS.reminders, reminders);
}

// --- Seed demo vet profile ---

export function seedDemoVetProfile(): void {
  const profiles = getStore<VetProfile>(STORE_KEYS.vetProfiles);
  if (profiles.length > 0) return;
  const demoVet: VetProfile = {
    id: "demo_vet_1",
    userId: "demo_vet_user",
    name: "Martin Dupont",
    specialty: "Generaliste",
    clinic: "Clinique VetCare",
    address: "12 rue des Animaux, 75001 Paris",
    phone: "01 23 45 67 89",
    availableDays: [1, 2, 3, 4, 5],
    slotDuration: 30,
    workStart: "09:00",
    workEnd: "18:00",
  };
  profiles.push(demoVet);
  setStore(STORE_KEYS.vetProfiles, profiles);

  const today = new Date();
  const allSlots: VetSlot[] = [];
  for (let d = 0; d < 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayOfWeek = date.getDay();
    if (!demoVet.availableDays.includes(dayOfWeek)) continue;
    const dateStr = date.toISOString().split("T")[0];
    const [startH] = demoVet.workStart.split(":").map(Number);
    const [endH] = demoVet.workEnd.split(":").map(Number);
    for (let h = startH; h < endH; h++) {
      for (let m = 0; m < 60; m += demoVet.slotDuration) {
        const eh = m + demoVet.slotDuration >= 60 ? h + 1 : h;
        const em = (m + demoVet.slotDuration) % 60;
        if (eh > endH || (eh === endH && em > 0)) continue;
        allSlots.push({
          id: generateId() + "_" + d + "_" + h + "_" + m,
          vetId: demoVet.userId,
          vetName: demoVet.name,
          clinic: demoVet.clinic,
          date: dateStr,
          startTime: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
          endTime: `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`,
          duration: demoVet.slotDuration,
          isBooked: Math.random() < 0.2,
        });
      }
    }
  }
  setStore(STORE_KEYS.vetSlots, allSlots);
}

// ================================================================
// SEED ALL DEMO DATA
// ================================================================

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

export function isDemoSeeded(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORE_KEYS.seeded) === "true";
}

export function seedAllDemoData(): { token: string; user: User } {
  if (typeof window === "undefined") throw new Error("Cannot seed on server");

  // Clear all existing data
  Object.values(STORE_KEYS).forEach((key) => localStorage.removeItem(key));
  localStorage.removeItem("petcare_token");
  localStorage.removeItem("petcare_user");

  const DEMO_USER_ID = "demo_owner_001";
  const VET_USER_ID = "demo_vet_001";
  const today = new Date().toISOString().split("T")[0];

  // --- Users ---
  const users = [
    {
      id: DEMO_USER_ID,
      email: "demo@petcare.fr",
      password: "demo1234",
      firstName: "Sophie",
      lastName: "Martin",
      role: "owner" as const,
      createdAt: daysAgo(90) + "T10:00:00Z",
    },
    {
      id: VET_USER_ID,
      email: "vet@petcare.fr",
      password: "vet1234",
      firstName: "Jean",
      lastName: "Dupont",
      role: "veterinarian" as const,
      createdAt: daysAgo(120) + "T08:00:00Z",
    },
  ];
  setStore(STORE_KEYS.users, users);

  // --- Animals ---
  const animals: Animal[] = [
    {
      id: "animal_001",
      name: "Luna",
      species: "cat",
      breed: "Siamois",
      birthDate: "2022-03-15",
      gender: "female",
      color: "Creme et chocolat",
      weight: 4.2,
      microchipNumber: "250269812345678",
      notes: "Tres joueuse, adore les cartons. Allergique au poulet.",
      ownerId: DEMO_USER_ID,
      createdAt: daysAgo(80) + "T10:00:00Z",
      updatedAt: daysAgo(2) + "T14:00:00Z",
    },
    {
      id: "animal_002",
      name: "Rex",
      species: "dog",
      breed: "Berger Allemand",
      birthDate: "2021-07-20",
      gender: "male",
      color: "Noir et feu",
      weight: 32.5,
      microchipNumber: "250269887654321",
      notes: "Tres protecteur, aime courir. Suit un regime hypoallergenique.",
      ownerId: DEMO_USER_ID,
      createdAt: daysAgo(75) + "T11:00:00Z",
      updatedAt: daysAgo(5) + "T09:00:00Z",
    },
    {
      id: "animal_003",
      name: "Kiwi",
      species: "bird",
      breed: "Canari",
      birthDate: "2023-01-10",
      gender: "male",
      color: "Jaune vif",
      weight: 0.025,
      notes: "Chante le matin. Cage nettoyee 2x par semaine.",
      ownerId: DEMO_USER_ID,
      createdAt: daysAgo(60) + "T15:00:00Z",
      updatedAt: daysAgo(10) + "T16:00:00Z",
    },
    {
      id: "animal_004",
      name: "Noisette",
      species: "rabbit",
      breed: "Nain Belier",
      birthDate: "2023-06-05",
      gender: "female",
      color: "Brun et blanc",
      weight: 1.8,
      notes: "Adore les carottes et le foin de Crau.",
      ownerId: DEMO_USER_ID,
      createdAt: daysAgo(45) + "T12:00:00Z",
      updatedAt: daysAgo(3) + "T10:00:00Z",
    },
  ];
  setStore(STORE_KEYS.animals, animals);

  // --- Medical Records ---
  const medicalRecords: MedicalRecord[] = [
    {
      id: "med_001", animalId: "animal_001", type: "consultation",
      title: "Bilan annuel", description: "Examen complet. Poids stable, dents propres, pelage brillant. RAS.",
      veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysAgo(15),
      notes: "Prochain bilan dans 12 mois", createdAt: daysAgo(15) + "T10:30:00Z",
    },
    {
      id: "med_002", animalId: "animal_001", type: "treatment",
      title: "Traitement anti-puces", description: "Application de Frontline Combo. Aucun parasite observe.",
      veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysAgo(45),
      createdAt: daysAgo(45) + "T11:00:00Z",
    },
    {
      id: "med_003", animalId: "animal_002", type: "consultation",
      title: "Boiterie patte arriere droite", description: "Legere entorse apres une course. Repos recommande 5 jours, anti-inflammatoire prescrit.",
      veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysAgo(10),
      notes: "Controle dans 10 jours si la boiterie persiste", createdAt: daysAgo(10) + "T14:00:00Z",
    },
    {
      id: "med_004", animalId: "animal_002", type: "exam",
      title: "Radio hanche", description: "Radiographie des hanches. Pas de signe de dysplasie. Articulations en bon etat.",
      veterinarian: "Dr. Marie Lambert", clinic: "Clinique VetCare", date: daysAgo(60),
      createdAt: daysAgo(60) + "T09:30:00Z",
    },
    {
      id: "med_005", animalId: "animal_002", type: "surgery",
      title: "Detartrage", description: "Detartrage sous anesthesie generale. 2 dents extraites (premolaires usees). Bonne recuperation.",
      veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysAgo(90),
      notes: "Alimentation molle pendant 3 jours", createdAt: daysAgo(90) + "T08:00:00Z",
    },
    {
      id: "med_006", animalId: "animal_003", type: "consultation",
      title: "Controle plumage", description: "Plumage en bonne sante. Ailes correctement taillees. Pas de parasites.",
      veterinarian: "Dr. Claire Moreau", clinic: "Clinique VetCare", date: daysAgo(30),
      createdAt: daysAgo(30) + "T16:00:00Z",
    },
    {
      id: "med_007", animalId: "animal_004", type: "consultation",
      title: "Verification des dents", description: "Les dents poussent normalement. Pas de malocclusion. Alimentation adaptee.",
      veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare", date: daysAgo(20),
      createdAt: daysAgo(20) + "T11:30:00Z",
    },
  ];
  setStore(STORE_KEYS.medicalRecords, medicalRecords);

  // --- Vaccinations ---
  const vaccinations: Vaccination[] = [
    {
      id: "vacc_001", animalId: "animal_001", name: "Typhus (Panleucopenie)",
      date: daysAgo(15), nextDueDate: daysFromNow(350), veterinarian: "Dr. Jean Dupont",
      batchNumber: "FEL-2024-8832", status: "up_to_date", createdAt: daysAgo(15) + "T10:45:00Z",
    },
    {
      id: "vacc_002", animalId: "animal_001", name: "Coryza",
      date: daysAgo(15), nextDueDate: daysFromNow(350), veterinarian: "Dr. Jean Dupont",
      batchNumber: "COR-2024-4451", status: "up_to_date", createdAt: daysAgo(15) + "T10:45:00Z",
    },
    {
      id: "vacc_003", animalId: "animal_001", name: "Leucose feline (FeLV)",
      date: daysAgo(200), nextDueDate: daysAgo(5), veterinarian: "Dr. Jean Dupont",
      batchNumber: "FLV-2023-1120", status: "overdue",
      notes: "Rappel en retard, a programmer rapidement", createdAt: daysAgo(200) + "T11:00:00Z",
    },
    {
      id: "vacc_004", animalId: "animal_002", name: "Rage",
      date: daysAgo(30), nextDueDate: daysFromNow(335), veterinarian: "Dr. Jean Dupont",
      batchNumber: "RAB-2024-7721", status: "up_to_date", createdAt: daysAgo(30) + "T09:00:00Z",
    },
    {
      id: "vacc_005", animalId: "animal_002", name: "DHPP (Maladie de Carre, Hepatite, Parvovirose, Parainfluenza)",
      date: daysAgo(30), nextDueDate: daysFromNow(335), veterinarian: "Dr. Jean Dupont",
      batchNumber: "DHP-2024-3305", status: "up_to_date", createdAt: daysAgo(30) + "T09:15:00Z",
    },
    {
      id: "vacc_006", animalId: "animal_002", name: "Leptospirose",
      date: daysAgo(180), nextDueDate: daysFromNow(10), veterinarian: "Dr. Jean Dupont",
      batchNumber: "LEP-2024-0092", status: "due_soon",
      notes: "Rappel a faire bientot", createdAt: daysAgo(180) + "T10:00:00Z",
    },
  ];
  setStore(STORE_KEYS.vaccinations, vaccinations);

  // --- Meals ---
  const meals: Meal[] = [
    { id: "meal_001", animalId: "animal_001", type: "breakfast", foodName: "Royal Canin Siamese", quantity: "50", unit: "g", time: "07:30", createdAt: daysAgo(0) + "T07:30:00Z" },
    { id: "meal_002", animalId: "animal_001", type: "dinner", foodName: "Royal Canin Siamese", quantity: "50", unit: "g", time: "18:00", createdAt: daysAgo(0) + "T18:00:00Z" },
    { id: "meal_003", animalId: "animal_001", type: "snack", foodName: "Friandises Dreamies", quantity: "10", unit: "g", time: "14:00", notes: "Recompense apres le jeu", createdAt: daysAgo(0) + "T14:00:00Z" },
    { id: "meal_004", animalId: "animal_002", type: "breakfast", foodName: "Pro Plan Large Athletic Poulet", quantity: "200", unit: "g", time: "07:00", createdAt: daysAgo(0) + "T07:00:00Z" },
    { id: "meal_005", animalId: "animal_002", type: "dinner", foodName: "Pro Plan Large Athletic Poulet", quantity: "250", unit: "g", time: "18:30", createdAt: daysAgo(0) + "T18:30:00Z" },
    { id: "meal_006", animalId: "animal_002", type: "snack", foodName: "Os a macher Pedigree DentaStix", quantity: "1", unit: "piece", time: "12:00", createdAt: daysAgo(0) + "T12:00:00Z" },
    { id: "meal_007", animalId: "animal_003", type: "breakfast", foodName: "Melange de graines canari", quantity: "5", unit: "g", time: "08:00", createdAt: daysAgo(0) + "T08:00:00Z" },
    { id: "meal_008", animalId: "animal_003", type: "snack", foodName: "Feuille de salade", quantity: "1", unit: "piece", time: "15:00", createdAt: daysAgo(0) + "T15:00:00Z" },
    { id: "meal_009", animalId: "animal_004", type: "breakfast", foodName: "Foin de Crau", quantity: "100", unit: "g", time: "07:00", notes: "Foin a volonte", createdAt: daysAgo(0) + "T07:00:00Z" },
    { id: "meal_010", animalId: "animal_004", type: "dinner", foodName: "Granules Versele-Laga", quantity: "30", unit: "g", time: "18:00", createdAt: daysAgo(0) + "T18:00:00Z" },
    { id: "meal_011", animalId: "animal_004", type: "snack", foodName: "Carotte fraiche", quantity: "1", unit: "piece", time: "10:00", createdAt: daysAgo(0) + "T10:00:00Z" },
  ];
  setStore(STORE_KEYS.meals, meals);

  // --- Weight Entries (historique sur plusieurs mois) ---
  const weightEntries: WeightEntry[] = [
    { id: "w_001", animalId: "animal_001", weight: 3.8, unit: "kg", date: daysAgo(120), createdAt: daysAgo(120) + "T10:00:00Z" },
    { id: "w_002", animalId: "animal_001", weight: 3.9, unit: "kg", date: daysAgo(90), createdAt: daysAgo(90) + "T10:00:00Z" },
    { id: "w_003", animalId: "animal_001", weight: 4.0, unit: "kg", date: daysAgo(60), createdAt: daysAgo(60) + "T10:00:00Z" },
    { id: "w_004", animalId: "animal_001", weight: 4.1, unit: "kg", date: daysAgo(30), createdAt: daysAgo(30) + "T10:00:00Z" },
    { id: "w_005", animalId: "animal_001", weight: 4.2, unit: "kg", date: daysAgo(5), createdAt: daysAgo(5) + "T10:00:00Z" },
    { id: "w_006", animalId: "animal_002", weight: 30.0, unit: "kg", date: daysAgo(150), createdAt: daysAgo(150) + "T09:00:00Z" },
    { id: "w_007", animalId: "animal_002", weight: 31.2, unit: "kg", date: daysAgo(120), createdAt: daysAgo(120) + "T09:00:00Z" },
    { id: "w_008", animalId: "animal_002", weight: 31.8, unit: "kg", date: daysAgo(90), createdAt: daysAgo(90) + "T09:00:00Z" },
    { id: "w_009", animalId: "animal_002", weight: 32.0, unit: "kg", date: daysAgo(60), createdAt: daysAgo(60) + "T09:00:00Z" },
    { id: "w_010", animalId: "animal_002", weight: 32.3, unit: "kg", date: daysAgo(30), createdAt: daysAgo(30) + "T09:00:00Z" },
    { id: "w_011", animalId: "animal_002", weight: 32.5, unit: "kg", date: daysAgo(3), createdAt: daysAgo(3) + "T09:00:00Z" },
    { id: "w_012", animalId: "animal_004", weight: 1.5, unit: "kg", date: daysAgo(60), createdAt: daysAgo(60) + "T12:00:00Z" },
    { id: "w_013", animalId: "animal_004", weight: 1.7, unit: "kg", date: daysAgo(30), createdAt: daysAgo(30) + "T12:00:00Z" },
    { id: "w_014", animalId: "animal_004", weight: 1.8, unit: "kg", date: daysAgo(3), createdAt: daysAgo(3) + "T12:00:00Z" },
  ];
  setStore(STORE_KEYS.weightEntries, weightEntries);

  // --- Appointments ---
  const appointments: Appointment[] = [
    {
      id: "appt_001", animalId: "animal_001", animalName: "Luna",
      title: "Rappel vaccin Leucose", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare",
      date: daysFromNow(5), time: "10:00", status: "scheduled",
      notes: "Vaccin FeLV en retard", ownerId: DEMO_USER_ID, createdAt: daysAgo(2) + "T14:00:00Z",
    },
    {
      id: "appt_002", animalId: "animal_002", animalName: "Rex",
      title: "Controle boiterie", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare",
      date: daysFromNow(3), time: "14:30", status: "scheduled",
      notes: "Verifier l'evolution de l'entorse", ownerId: DEMO_USER_ID, createdAt: daysAgo(5) + "T10:00:00Z",
    },
    {
      id: "appt_003", animalId: "animal_002", animalName: "Rex",
      title: "Rappel Leptospirose", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare",
      date: daysFromNow(12), time: "09:30", status: "scheduled",
      ownerId: DEMO_USER_ID, createdAt: daysAgo(1) + "T11:00:00Z",
    },
    {
      id: "appt_004", animalId: "animal_001", animalName: "Luna",
      title: "Bilan annuel", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare",
      date: daysAgo(15), time: "10:30", status: "completed",
      notes: "RAS - tout est normal", ownerId: DEMO_USER_ID, createdAt: daysAgo(30) + "T09:00:00Z",
    },
    {
      id: "appt_005", animalId: "animal_004", animalName: "Noisette",
      title: "Controle dentaire", veterinarian: "Dr. Jean Dupont", clinic: "Clinique VetCare",
      date: daysAgo(20), time: "11:30", status: "completed",
      ownerId: DEMO_USER_ID, createdAt: daysAgo(35) + "T15:00:00Z",
    },
  ];
  setStore(STORE_KEYS.appointments, appointments);

  // --- Reminders ---
  const reminders: Reminder[] = [
    {
      id: "rem_001", animalId: "animal_001", animalName: "Luna",
      title: "Traitement anti-puces", description: "Appliquer Frontline Combo",
      type: "medication", date: daysFromNow(15), time: "10:00", recurrence: "monthly", isActive: true,
      createdAt: daysAgo(10) + "T08:00:00Z",
    },
    {
      id: "rem_002", animalId: "animal_002", animalName: "Rex",
      title: "Vermifuge trimestriel", description: "Donner 1 comprime Milbemax",
      type: "medication", date: daysFromNow(20), time: "08:00", recurrence: "monthly", isActive: true,
      createdAt: daysAgo(5) + "T09:00:00Z",
    },
    {
      id: "rem_003", animalId: "animal_002", animalName: "Rex",
      title: "Toilettage", description: "Rendez-vous chez le toiletteur pour bain et brossage",
      type: "grooming", date: daysFromNow(7), time: "14:00", recurrence: "monthly", isActive: true,
      createdAt: daysAgo(3) + "T10:00:00Z",
    },
    {
      id: "rem_004", animalId: "animal_003", animalName: "Kiwi",
      title: "Nettoyage cage", description: "Nettoyage complet de la cage et changement du fond",
      type: "grooming", date: daysFromNow(2), time: "09:00", recurrence: "weekly", isActive: true,
      createdAt: daysAgo(7) + "T08:00:00Z",
    },
    {
      id: "rem_005", animalId: "animal_001", animalName: "Luna",
      title: "Rappel vaccin Leucose", description: "Vaccin FeLV en retard - prendre RDV",
      type: "vaccination", date: today, time: "09:00", recurrence: "none", isActive: true,
      createdAt: daysAgo(5) + "T11:00:00Z",
    },
    {
      id: "rem_006", animalId: "animal_004", animalName: "Noisette",
      title: "Acheter du foin", description: "Commander 5kg de foin de Crau sur Zooplus",
      type: "feeding", date: daysFromNow(1), time: "10:00", recurrence: "monthly", isActive: true,
      createdAt: daysAgo(1) + "T14:00:00Z",
    },
  ];
  setStore(STORE_KEYS.reminders, reminders);

  // --- Tracking entries (historique recente) ---
  interface TrackingEntry {
    id: string; animalId: string; type: string; label: string; note: string; time: string; date: string;
  }
  const trackingEntries: TrackingEntry[] = [
    { id: "tr_001", animalId: "animal_001", type: "meal", label: "Repas", note: "Croquettes Royal Canin - 50g", time: "07:30", date: today },
    { id: "tr_002", animalId: "animal_001", type: "water", label: "Eau", note: "Fontaine a eau remplie", time: "07:35", date: today },
    { id: "tr_003", animalId: "animal_001", type: "play", label: "Jeu", note: "Canne a peche - 15 min", time: "10:00", date: today },
    { id: "tr_004", animalId: "animal_001", type: "mood", label: "Humeur", note: "Tres caline ce matin", time: "08:15", date: today },
    { id: "tr_005", animalId: "animal_002", type: "meal", label: "Repas", note: "Pro Plan - 200g + complement articulaire", time: "07:00", date: today },
    { id: "tr_006", animalId: "animal_002", type: "play", label: "Jeu", note: "Promenade au parc - 45 min", time: "09:00", date: today },
    { id: "tr_007", animalId: "animal_002", type: "health", label: "Sante", note: "Boiterie quasi disparue, marche normalement", time: "09:45", date: today },
    { id: "tr_008", animalId: "animal_002", type: "water", label: "Eau", note: "Gamelle remplie 2x", time: "12:00", date: today },
    { id: "tr_009", animalId: "animal_001", type: "meal", label: "Repas", note: "Patee Whiskas thon - 85g", time: "12:30", date: daysAgo(1) },
    { id: "tr_010", animalId: "animal_001", type: "groom", label: "Toilette", note: "Brossage du pelage - 10 min", time: "17:00", date: daysAgo(1) },
    { id: "tr_011", animalId: "animal_002", type: "meal", label: "Repas", note: "Pro Plan - 250g", time: "18:30", date: daysAgo(1) },
    { id: "tr_012", animalId: "animal_002", type: "note", label: "Notes", note: "RDV toiletteur confirme pour la semaine prochaine", time: "20:00", date: daysAgo(1) },
    { id: "tr_013", animalId: "animal_004", type: "meal", label: "Repas", note: "Foin + 2 carottes", time: "07:00", date: today },
    { id: "tr_014", animalId: "animal_004", type: "play", label: "Jeu", note: "Sortie dans l'enclos - 30 min", time: "11:00", date: today },
  ];
  setStore(STORE_KEYS.tracking, trackingEntries);

  // --- Vet Profile + Slots ---
  const vetProfile: VetProfile = {
    id: "vp_001",
    userId: VET_USER_ID,
    name: "Dr. Jean Dupont",
    specialty: "Generaliste",
    clinic: "Clinique VetCare",
    address: "12 rue des Animaux, 75001 Paris",
    phone: "01 23 45 67 89",
    availableDays: [1, 2, 3, 4, 5],
    slotDuration: 30,
    workStart: "09:00",
    workEnd: "18:00",
  };
  setStore(STORE_KEYS.vetProfiles, [vetProfile]);

  const allSlots: VetSlot[] = [];
  const now = new Date();
  for (let d = -3; d < 21; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const dayOfWeek = date.getDay();
    if (!vetProfile.availableDays.includes(dayOfWeek)) continue;
    const dateStr = date.toISOString().split("T")[0];
    for (let h = 9; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 17 && m === 30) continue;
        const eh = m + 30 >= 60 ? h + 1 : h;
        const em = (m + 30) % 60;
        const isPast = d < 0;
        allSlots.push({
          id: `slot_${d}_${h}_${m}`,
          vetId: VET_USER_ID,
          vetName: vetProfile.name,
          clinic: vetProfile.clinic,
          date: dateStr,
          startTime: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
          endTime: `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`,
          duration: 30,
          isBooked: isPast ? Math.random() < 0.6 : Math.random() < 0.15,
        });
      }
    }
  }
  setStore(STORE_KEYS.vetSlots, allSlots);

  // Mark as seeded
  localStorage.setItem(STORE_KEYS.seeded, "true");

  // Return demo user session
  const demoUser: User = {
    id: DEMO_USER_ID,
    email: "demo@petcare.fr",
    firstName: "Sophie",
    lastName: "Martin",
    role: "owner",
    createdAt: users[0].createdAt,
  };
  const token = `mock_${DEMO_USER_ID}_${Date.now()}`;
  return { token, user: demoUser };
}
