const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("petcare_token");
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { skipAuth = false, headers: customHeaders, ...rest } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((customHeaders as Record<string, string>) || {}),
    };

    if (!skipAuth) {
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("petcare_token");
          localStorage.removeItem("petcare_user");
          window.location.href = "/login";
        }
      }
      const error = await response.json().catch(() => ({ message: "An error occurred" }));
      throw { message: error.message || "An error occurred", status: response.status };
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string; user: import("@/types").User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
  }

  async register(data: import("@/types").RegisterRequest) {
    return this.request<{ token: string; user: import("@/types").User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuth: true,
    });
  }

  // Animals
  async getAnimals() {
    return this.request<import("@/types").Animal[]>("/animals");
  }

  async getAnimal(id: string) {
    return this.request<import("@/types").Animal>(`/animals/${id}`);
  }

  async createAnimal(data: Partial<import("@/types").Animal>) {
    return this.request<import("@/types").Animal>("/animals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAnimal(id: string, data: Partial<import("@/types").Animal>) {
    return this.request<import("@/types").Animal>(`/animals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAnimal(id: string) {
    return this.request<void>(`/animals/${id}`, { method: "DELETE" });
  }

  // Medical Records
  async getMedicalRecords(animalId: string) {
    return this.request<import("@/types").MedicalRecord[]>(`/animals/${animalId}/medical`);
  }

  async createMedicalRecord(animalId: string, data: Partial<import("@/types").MedicalRecord>) {
    return this.request<import("@/types").MedicalRecord>(`/animals/${animalId}/medical`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Vaccinations
  async getVaccinations(animalId: string) {
    return this.request<import("@/types").Vaccination[]>(`/animals/${animalId}/vaccinations`);
  }

  async createVaccination(animalId: string, data: Partial<import("@/types").Vaccination>) {
    return this.request<import("@/types").Vaccination>(`/animals/${animalId}/vaccinations`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Nutrition
  async getMeals(animalId: string) {
    return this.request<import("@/types").Meal[]>(`/animals/${animalId}/meals`);
  }

  async createMeal(animalId: string, data: Partial<import("@/types").Meal>) {
    return this.request<import("@/types").Meal>(`/animals/${animalId}/meals`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async deleteMeal(animalId: string, mealId: string) {
    return this.request<void>(`/animals/${animalId}/meals/${mealId}`, { method: "DELETE" });
  }

  // Weight
  async getWeightEntries(animalId: string) {
    return this.request<import("@/types").WeightEntry[]>(`/animals/${animalId}/weight`);
  }

  async createWeightEntry(animalId: string, data: Partial<import("@/types").WeightEntry>) {
    return this.request<import("@/types").WeightEntry>(`/animals/${animalId}/weight`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Appointments
  async getAppointments(animalId?: string) {
    const endpoint = animalId ? `/animals/${animalId}/appointments` : "/appointments";
    return this.request<import("@/types").Appointment[]>(endpoint);
  }

  async createAppointment(data: Partial<import("@/types").Appointment>) {
    return this.request<import("@/types").Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAppointment(id: string, data: Partial<import("@/types").Appointment>) {
    return this.request<import("@/types").Appointment>(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAppointment(id: string) {
    return this.request<void>(`/appointments/${id}`, { method: "DELETE" });
  }

  // Reminders
  async getReminders() {
    return this.request<import("@/types").Reminder[]>("/reminders");
  }

  async createReminder(data: Partial<import("@/types").Reminder>) {
    return this.request<import("@/types").Reminder>("/reminders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateReminder(id: string, data: Partial<import("@/types").Reminder>) {
    return this.request<import("@/types").Reminder>(`/reminders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteReminder(id: string) {
    return this.request<void>(`/reminders/${id}`, { method: "DELETE" });
  }

  // Vet Profiles
  async getVetProfiles() {
    return this.request<import("@/types").VetProfile[]>("/vet/profiles");
  }

  async getVetProfile(userId: string) {
    return this.request<import("@/types").VetProfile>(`/vet/profiles/${userId}`);
  }

  async saveVetProfile(data: Partial<import("@/types").VetProfile>) {
    return this.request<import("@/types").VetProfile>("/vet/profiles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateVetProfile(id: string, data: Partial<import("@/types").VetProfile>) {
    return this.request<import("@/types").VetProfile>(`/vet/profiles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Assistant
  async askAssistant(data: import("@/types").AssistantRequest) {
    return this.request<{ message: string }>("/assistant/ask", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
