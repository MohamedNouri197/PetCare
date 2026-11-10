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
    const entries = await mongo.collection("weightRecords")
      .find({ animalId: params.id })
      .sort({ date: -1 })
      .toArray();
    return NextResponse.json(entries.map(mapDoc));
  }
  const db = getDB();
  const entries = db.weightEntries
    .filter((w) => w.animalId === params.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const entry = {
      animalId: params.id,
      weight: data.weight || 0,
      date: data.date || new Date().toISOString().split("T")[0],
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
    };
    const result = await mongo.collection("weightRecords").insertOne(entry);
    return NextResponse.json({ id: result.insertedId.toString(), ...entry }, { status: 201 });
  }
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
