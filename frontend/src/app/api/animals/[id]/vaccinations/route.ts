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
    const vaccinations = await mongo.collection("vaccinations")
      .find({ animalId: params.id })
      .sort({ date: -1 })
      .toArray();
    return NextResponse.json(vaccinations.map(mapDoc));
  }
  const db = getDB();
  const vaccinations = db.vaccinations
    .filter((v) => v.animalId === params.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  return NextResponse.json(vaccinations);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const vaccination = {
      animalId: params.id,
      name: data.name || "",
      date: data.date || new Date().toISOString().split("T")[0],
      nextDueDate: data.nextDueDate || "",
      veterinarian: data.veterinarian || "",
      clinic: data.clinic || "",
      batchNumber: data.batchNumber || null,
      status: data.status || "up_to_date",
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
    };
    const result = await mongo.collection("vaccinations").insertOne(vaccination);
    return NextResponse.json({ id: result.insertedId.toString(), ...vaccination }, { status: 201 });
  }
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
