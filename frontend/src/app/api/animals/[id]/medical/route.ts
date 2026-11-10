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
    const records = await mongo.collection("medicalRecords")
      .find({ animalId: params.id })
      .sort({ date: -1 })
      .toArray();
    return NextResponse.json(records.map(mapDoc));
  }
  const db = getDB();
  const records = db.medicalRecords
    .filter((r) => r.animalId === params.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(records);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const record = {
      animalId: params.id,
      type: data.type || "consultation",
      title: data.title || "",
      description: data.description || "",
      veterinarian: data.veterinarian || "",
      clinic: data.clinic || "",
      date: data.date || new Date().toISOString().split("T")[0],
      notes: data.notes || null,
      cost: data.cost || null,
      createdAt: new Date().toISOString(),
    };
    const result = await mongo.collection("medicalRecords").insertOne(record);
    return NextResponse.json({ id: result.insertedId.toString(), ...record }, { status: 201 });
  }
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
