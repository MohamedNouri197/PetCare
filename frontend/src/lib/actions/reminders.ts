"use server";

import { getDB, generateId } from "@/lib/db";
import type { Reminder } from "@/types";

export async function getRemindersAction(): Promise<Reminder[]> {
  const db = getDB();
  return [...db.reminders].sort((a, b) => a.date.localeCompare(b.date));
}

export async function createReminderAction(
  data: Partial<Reminder>
): Promise<Reminder> {
  const db = getDB();
  const reminder: Reminder = {
    id: generateId(),
    animalId: data.animalId,
    animalName: data.animalName,
    title: data.title || "",
    description: data.description,
    type: data.type || "other",
    date: data.date || new Date().toISOString().split("T")[0],
    time: data.time,
    recurrence: data.recurrence || "none",
    isActive: data.isActive !== false,
    createdAt: new Date().toISOString(),
  };
  db.reminders.push(reminder);
  return reminder;
}

export async function updateReminderAction(
  id: string,
  data: Partial<Reminder>
): Promise<Reminder | null> {
  const db = getDB();
  const index = db.reminders.findIndex((r) => r.id === id);
  if (index === -1) return null;
  db.reminders[index] = { ...db.reminders[index], ...data };
  return db.reminders[index];
}

export async function deleteReminderAction(id: string): Promise<boolean> {
  const db = getDB();
  const len = db.reminders.length;
  db.reminders = db.reminders.filter((r) => r.id !== id);
  return db.reminders.length < len;
}
