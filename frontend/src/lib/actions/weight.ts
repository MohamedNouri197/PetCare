"use server";

import { getDB, generateId } from "@/lib/db";
import type { WeightEntry } from "@/types";

export async function getWeightEntriesAction(animalId: string): Promise<WeightEntry[]> {
  const db = getDB();
  return db.weightEntries
    .filter((w) => w.animalId === animalId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function createWeightEntryAction(
  animalId: string,
  data: Partial<WeightEntry>
): Promise<WeightEntry> {
  const db = getDB();
  const entry: WeightEntry = {
    id: generateId(),
    animalId,
    weight: data.weight || 0,
    unit: data.unit || "kg",
    date: data.date || new Date().toISOString().split("T")[0],
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };
  db.weightEntries.push(entry);
  return entry;
}
