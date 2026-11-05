import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const meals = db.meals
    .filter((m) => m.animalId === params.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(meals);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const db = getDB();
  const meal = {
    id: generateId(),
    animalId: params.id,
    type: data.type || "breakfast",
    foodName: data.foodName || "",
    quantity: data.quantity || "",
    unit: data.unit || "g",
    time: data.time || "08:00",
    notes: data.notes,
    createdAt: new Date().toISOString(),
  };
  db.meals.push(meal);
  return NextResponse.json(meal, { status: 201 });
}
