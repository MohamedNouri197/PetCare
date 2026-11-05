"use server";

import { getDB, generateId } from "@/lib/db";
import type { Animal } from "@/types";

export async function getAnimalsAction(userId: string): Promise<Animal[]> {
  const db = getDB();
  return db.animals.filter((a) => a.ownerId === userId);
}

export async function getAnimalAction(id: string): Promise<Animal> {
  const db = getDB();
  const animal = db.animals.find((a) => a.id === id);
  if (!animal) throw new Error("Animal non trouve");
  return animal;
}

export async function createAnimalAction(data: Partial<Animal>, userId: string): Promise<Animal> {
  const db = getDB();
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
  db.animals.push(newAnimal);
  return newAnimal;
}

export async function updateAnimalAction(id: string, data: Partial<Animal>): Promise<Animal> {
  const db = getDB();
  const index = db.animals.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Animal non trouve");
  db.animals[index] = { ...db.animals[index], ...data, updatedAt: new Date().toISOString() };
  return db.animals[index];
}

export async function deleteAnimalAction(id: string): Promise<void> {
  const db = getDB();
  const index = db.animals.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Animal non trouve");
  db.animals.splice(index, 1);
}
