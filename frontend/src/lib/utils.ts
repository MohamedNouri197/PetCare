export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

export function formatWeight(weight: number, unit: string = "kg"): string {
  return `${weight.toFixed(1)} ${unit}`;
}

export function calculateAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
  const months = Math.floor((diffMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));

  if (years === 0) {
    return `${months} mois`;
  }
  if (months === 0) {
    return `${years} an${years > 1 ? "s" : ""}`;
  }
  return `${years} an${years > 1 ? "s" : ""} et ${months} mois`;
}

export function getSpeciesLabel(species: string): string {
  const labels: Record<string, string> = {
    dog: "Chien",
    cat: "Chat",
    bird: "Oiseau",
    rabbit: "Lapin",
    hamster: "Hamster",
    fish: "Poisson",
    reptile: "Reptile",
    other: "Autre",
  };
  return labels[species] || species;
}

export function getSpeciesEmoji(species: string): string {
  const emojis: Record<string, string> = {
    dog: "🐕",
    cat: "🐱",
    bird: "🐦",
    rabbit: "🐰",
    hamster: "🐹",
    fish: "🐠",
    reptile: "🦎",
    other: "🐾",
  };
  return emojis[species] || "🐾";
}

export function getMedicalTypeBadge(type: string): { label: string; color: string } {
  const badges: Record<string, { label: string; color: string }> = {
    consultation: { label: "Consultation", color: "bg-primary/10 text-primary" },
    surgery: { label: "Chirurgie", color: "bg-danger/10 text-danger" },
    exam: { label: "Examen", color: "bg-accent/10 text-accent" },
    treatment: { label: "Traitement", color: "bg-warning/10 text-warning" },
    emergency: { label: "Urgence", color: "bg-secondary/10 text-secondary" },
  };
  return badges[type] || { label: type, color: "bg-gray-100 text-gray-600" };
}

export function getVaccinationStatusBadge(status: string): { label: string; color: string } {
  const badges: Record<string, { label: string; color: string }> = {
    up_to_date: { label: "A jour", color: "bg-success/10 text-success" },
    due_soon: { label: "Bientot", color: "bg-warning/10 text-warning" },
    overdue: { label: "En retard", color: "bg-danger/10 text-danger" },
  };
  return badges[status] || { label: status, color: "bg-gray-100 text-gray-600" };
}

export function getAppointmentStatusBadge(status: string): { label: string; color: string } {
  const badges: Record<string, { label: string; color: string }> = {
    scheduled: { label: "Planifie", color: "bg-primary/10 text-primary" },
    completed: { label: "Termine", color: "bg-success/10 text-success" },
    cancelled: { label: "Annule", color: "bg-danger/10 text-danger" },
  };
  return badges[status] || { label: status, color: "bg-gray-100 text-gray-600" };
}

export function getReminderTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    vaccination: "Vaccination",
    appointment: "Rendez-vous",
    medication: "Medicament",
    grooming: "Toilettage",
    feeding: "Alimentation",
    other: "Autre",
  };
  return labels[type] || type;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    breakfast: "Petit-dejeuner",
    lunch: "Dejeuner",
    dinner: "Diner",
    snack: "Gouter",
  };
  return labels[type] || type;
}
