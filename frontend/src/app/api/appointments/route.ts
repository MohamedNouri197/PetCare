import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";

export async function GET(req: NextRequest) {
  const db = getDB();
  const userId = req.nextUrl.searchParams.get("userId");
  const appointments = userId
    ? db.appointments.filter((a) => a.ownerId === userId)
    : db.appointments;
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = getDB();
  const animal = db.animals.find((a) => a.id === data.animalId);
  const appointment = {
    id: generateId(),
    animalId: data.animalId || "",
    animalName: animal?.name || data.animalName || "",
    title: data.title || "",
    description: data.description,
    veterinarian: data.veterinarian || "",
    clinic: data.clinic || "",
    date: data.date || "",
    time: data.time || "",
    status: "scheduled" as const,
    notes: data.notes,
    ownerId: data.ownerId || "",
    createdAt: new Date().toISOString(),
  };
  db.appointments.push(appointment);
  return NextResponse.json(appointment, { status: 201 });
}
