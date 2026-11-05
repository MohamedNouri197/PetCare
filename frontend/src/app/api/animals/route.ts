import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";

export async function GET(req: NextRequest) {
  const db = getDB();
  const userId = req.nextUrl.searchParams.get("userId");
  const animals = userId ? db.animals.filter((a) => a.ownerId === userId) : db.animals;
  return NextResponse.json(animals);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = getDB();
  const animal = {
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
    ownerId: data.ownerId || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.animals.push(animal);
  return NextResponse.json(animal, { status: 201 });
}
