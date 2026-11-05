"use server";

import { getDB, generateId } from "@/lib/db";
import type { MedicalRecord } from "@/types";

export async function getMedicalRecordsAction(animalId: string): Promise<MedicalRecord[]> {
  const db = getDB();
  return db.medicalRecords
    .filter((r) => r.animalId === animalId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function createMedicalRecordAction(
  animalId: string,
  data: Partial<MedicalRecord>
): Promise<MedicalRecord> {
  const db = getDB();
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
  db.medicalRecords.push(record);
  return record;
}
