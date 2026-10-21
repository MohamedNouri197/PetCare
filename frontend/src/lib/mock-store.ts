import type { User, Animal, RegisterRequest, Appointment, VetSlot, VetProfile } from "@/types";

const STORE_KEYS = {
  users: "petcare_mock_users",
  animals: "petcare_mock_animals",
  appointments: "petcare_mock_appointments",
  vetSlots: "petcare_mock_vet_slots",
  vetProfiles: "petcare_mock_vet_profiles",
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
