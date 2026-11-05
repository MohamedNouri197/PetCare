import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const records = db.medicalRecords
    .filter((r) => r.animalId === params.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(records);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const db = getDB();
  const record = {
    id: generateId(),
    animalId: params.id,
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
  return NextResponse.json(record, { status: 201 });
}
