"use server";

import { getDB, generateId } from "@/lib/db";
import type { Appointment } from "@/types";

export async function getAppointmentsAction(userId?: string): Promise<Appointment[]> {
  const db = getDB();
  if (!userId) return db.appointments;
  return db.appointments.filter((a) => a.ownerId === userId);
}

export async function createAppointmentAction(
  data: Partial<Appointment>,
  userId: string
): Promise<Appointment> {
  const db = getDB();
  const animal = db.animals.find((a) => a.id === data.animalId);
  const appointment: Appointment = {
    id: generateId(),
    animalId: data.animalId || "",
    animalName: animal?.name || data.animalName || "",
    title: data.title || "",
    description: data.description,
    veterinarian: data.veterinarian || "",
    clinic: data.clinic || "",
    date: data.date || "",
    time: data.time || "",
    status: "scheduled",
    notes: data.notes,
    ownerId: userId,
    createdAt: new Date().toISOString(),
  };
  db.appointments.push(appointment);
  return appointment;
}

export async function updateAppointmentAction(
  id: string,
  data: Partial<Appointment>
): Promise<Appointment | null> {
  const db = getDB();
  const index = db.appointments.findIndex((a) => a.id === id);
  if (index === -1) return null;
  db.appointments[index] = { ...db.appointments[index], ...data };
  return db.appointments[index];
}

export async function deleteAppointmentAction(id: string): Promise<boolean> {
  const db = getDB();
  const len = db.appointments.length;
  db.appointments = db.appointments.filter((a) => a.id !== id);
  return db.appointments.length < len;
}
