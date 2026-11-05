"use server";

import { getDB, generateId } from "@/lib/db";
import type { Vaccination } from "@/types";

export async function getVaccinationsAction(animalId: string): Promise<Vaccination[]> {
  const db = getDB();
  return db.vaccinations
    .filter((v) => v.animalId === animalId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function createVaccinationAction(
  animalId: string,
  data: Partial<Vaccination>
): Promise<Vaccination> {
  const db = getDB();
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
  db.vaccinations.push(vacc);
  return vacc;
}
