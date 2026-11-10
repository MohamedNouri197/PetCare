import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";
import { isMongoEnabled, getMongoDb } from "@/lib/mongodb";

function mapDoc(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const meals = await mongo.collection("meals")
      .find({ animalId: params.id })
      .toArray();
    return NextResponse.json(meals.map(mapDoc));
  }
  const db = getDB();
  const meals = db.meals
    .filter((m) => m.animalId === params.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(meals);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const meal = {
      animalId: params.id,
      foodName: data.foodName || "",
      foodBrand: data.foodBrand || "",
      quantity: data.quantity || 0,
      unit: data.unit || "g",
      scheduledTime: data.time || data.scheduledTime || "08:00",
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
    };
    const result = await mongo.collection("meals").insertOne(meal);
    return NextResponse.json({ id: result.insertedId.toString(), ...meal }, { status: 201 });
  }
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
