import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const entries = db.weightEntries
    .filter((w) => w.animalId === params.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const db = getDB();
  const entry = {
    id: generateId(),
    animalId: params.id,
    weight: data.weight || 0,
    unit: data.unit || "kg",
    date: data.date || new Date().toISOString().split("T")[0],
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };
  db.weightEntries.push(entry);
  return NextResponse.json(entry, { status: 201 });
}
