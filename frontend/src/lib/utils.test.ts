import {
  formatWeight,
  formatTime,
  getSpeciesLabel,
  getSpeciesEmoji,
  getMedicalTypeBadge,
  getVaccinationStatusBadge,
  getAppointmentStatusBadge,
  getReminderTypeLabel,
  getMealTypeLabel,
  cn,
  daysUntil,
} from "./utils";

describe("formatWeight", () => {
  it("formats with default unit kg", () => {
    expect(formatWeight(5.3)).toBe("5.3 kg");
  });

  it("formats with lbs unit", () => {
    expect(formatWeight(11.0, "lbs")).toBe("11.0 lbs");
  });
});

describe("formatTime", () => {
  it("slices to HH:MM", () => {
    expect(formatTime("14:30:00")).toBe("14:30");
    expect(formatTime("09:00")).toBe("09:00");
  });
});

describe("getSpeciesLabel", () => {
  it("returns French label for known species", () => {
    expect(getSpeciesLabel("dog")).toBe("Chien");
    expect(getSpeciesLabel("cat")).toBe("Chat");
    expect(getSpeciesLabel("rabbit")).toBe("Lapin");
  });

  it("returns raw value for unknown species", () => {
    expect(getSpeciesLabel("dragon")).toBe("dragon");
  });
});

describe("getSpeciesEmoji", () => {
  it("returns emoji for known species", () => {
    expect(getSpeciesEmoji("dog")).toBe("\u{1F415}");
    expect(getSpeciesEmoji("cat")).toBe("\u{1F431}");
  });

  it("returns default paw for unknown", () => {
    expect(getSpeciesEmoji("unknown")).toBe("\u{1F43E}");
  });
});

describe("getMedicalTypeBadge", () => {
  it("returns correct label and color for consultation", () => {
    const badge = getMedicalTypeBadge("consultation");
    expect(badge.label).toBe("Consultation");
    expect(badge.color).toContain("primary");
  });

  it("returns fallback for unknown type", () => {
    const badge = getMedicalTypeBadge("xray");
    expect(badge.label).toBe("xray");
  });
});

describe("getVaccinationStatusBadge", () => {
  it("returns correct label for up_to_date", () => {
    expect(getVaccinationStatusBadge("up_to_date").label).toBe("A jour");
  });

  it("returns correct label for overdue", () => {
    expect(getVaccinationStatusBadge("overdue").label).toBe("En retard");
  });
});

describe("getAppointmentStatusBadge", () => {
  it("returns correct label for scheduled", () => {
    expect(getAppointmentStatusBadge("scheduled").label).toBe("Planifie");
  });

  it("returns correct label for completed", () => {
    expect(getAppointmentStatusBadge("completed").label).toBe("Termine");
  });

  it("falls back for unknown status", () => {
    expect(getAppointmentStatusBadge("pending").label).toBe("pending");
  });
});

describe("getReminderTypeLabel", () => {
  it("returns French label for known types", () => {
    expect(getReminderTypeLabel("vaccination")).toBe("Vaccination");
    expect(getReminderTypeLabel("medication")).toBe("Medicament");
    expect(getReminderTypeLabel("feeding")).toBe("Alimentation");
  });

  it("returns raw value for unknown type", () => {
    expect(getReminderTypeLabel("custom")).toBe("custom");
  });
});

describe("getMealTypeLabel", () => {
  it("returns French label for known types", () => {
    expect(getMealTypeLabel("breakfast")).toBe("Petit-dejeuner");
    expect(getMealTypeLabel("lunch")).toBe("Dejeuner");
    expect(getMealTypeLabel("dinner")).toBe("Diner");
    expect(getMealTypeLabel("snack")).toBe("Gouter");
  });
});

describe("cn", () => {
  it("joins class strings", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out non-strings and empty strings", () => {
    expect(cn("a", "", null, undefined, false, "b")).toBe("a b");
  });

  it("returns empty string when no valid classes", () => {
    expect(cn(null, undefined)).toBe("");
  });
});

describe("daysUntil", () => {
  it("returns 0 for today", () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    expect(daysUntil(today.toISOString())).toBe(0);
  });

  it("returns positive for future date", () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    expect(daysUntil(future.toISOString())).toBe(7);
  });

  it("returns negative for past date", () => {
    const past = new Date();
    past.setDate(past.getDate() - 3);
    expect(daysUntil(past.toISOString())).toBe(-3);
  });
});
