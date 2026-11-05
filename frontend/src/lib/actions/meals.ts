"use server";

import { getDB, generateId } from "@/lib/db";
import type { Meal } from "@/types";

export async function getMealsAction(animalId: string): Promise<Meal[]> {
  const db = getDB();
  return db.meals
    .filter((m) => m.animalId === animalId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createMealAction(
  animalId: string,
  data: Partial<Meal>
): Promise<Meal> {
  const db = getDB();
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
  db.meals.push(meal);
  return meal;
}

export async function deleteMealAction(
  animalId: string,
  mealId: string
): Promise<boolean> {
  const db = getDB();
  const len = db.meals.length;
  db.meals = db.meals.filter(
    (m) => !(m.id === mealId && m.animalId === animalId)
  );
  return db.meals.length < len;
}
