import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const vaccinations = db.vaccinations
    .filter((v) => v.animalId === params.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(vaccinations);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const db = getDB();
  const vaccination = {
    id: generateId(),
    animalId: params.id,
    name: data.name || "",
    date: data.date || new Date().toISOString().split("T")[0],
    nextDueDate: data.nextDueDate || "",
    veterinarian: data.veterinarian || "",
    batchNumber: data.batchNumber,
    status: data.status || "up_to_date",
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };
  db.vaccinations.push(vaccination);
  return NextResponse.json(vaccination, { status: 201 });
}
