export type Species = "dog" | "cat" | "bird" | "rabbit" | "hamster" | "fish" | "reptile" | "other";

export type UserRole = "owner" | "veterinarian";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

export interface Animal {
  id: string;
  name: string;
  species: Species;
  breed: string;
  birthDate: string;
  gender: "male" | "female";
  color: string;
  weight: number;
  photoUrl?: string;
  microchipNumber?: string;
  notes?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  animalId: string;
  type: "consultation" | "surgery" | "exam" | "treatment" | "emergency";
  title: string;
  description: string;
  veterinarian: string;
  clinic: string;
  date: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
}

export interface Vaccination {
  id: string;
  animalId: string;
  name: string;
  date: string;
  nextDueDate: string;
  veterinarian: string;
  batchNumber?: string;
  status: "up_to_date" | "due_soon" | "overdue";
  notes?: string;
  createdAt: string;
}

export interface Meal {
  id: string;
  animalId: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  foodName: string;
  quantity: string;
  unit: string;
  time: string;
  notes?: string;
  createdAt: string;
}

export interface WeightEntry {
  id: string;
  animalId: string;
  weight: number;
  unit: "kg" | "lbs";
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  animalId: string;
  animalName?: string;
  title: string;
  description?: string;
  veterinarian: string;
  clinic: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  ownerId?: string;
  slotId?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  animalId?: string;
  animalName?: string;
  title: string;
  description?: string;
  type: "vaccination" | "appointment" | "medication" | "grooming" | "feeding" | "other";
  date: string;
  time?: string;
  recurrence?: "none" | "daily" | "weekly" | "monthly" | "yearly";
  isActive: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AssistantRequest {
  animalId: string;
  symptoms: string[];
  additionalInfo?: string;
}

export interface VetSlot {
  id: string;
  vetId: string;
  vetName: string;
  clinic: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  isBooked: boolean;
  bookedBy?: string;
  appointmentId?: string;
}

export interface VetProfile {
  id: string;
  userId: string;
  name: string;
  specialty: string;
  clinic: string;
  address: string;
  phone: string;
  availableDays: number[];
  slotDuration: number;
  workStart: string;
  workEnd: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}
