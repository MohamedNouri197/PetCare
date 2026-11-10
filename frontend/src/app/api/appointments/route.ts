import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";
import { isMongoEnabled, getMongoDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const filter = userId ? { ownerId: userId } : {};
    const docs = await mongo.collection("appointments").find(filter).toArray();
    const appointments = docs.map((d) => ({ ...d, id: d._id.toString(), _id: undefined }));
    return NextResponse.json(appointments);
  }

  const db = getDB();
  const appointments = userId
    ? db.appointments.filter((a) => a.ownerId === userId)
    : db.appointments;
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const animal = await mongo.collection("animals").findOne({ _id: data.animalId });
    const appointment = {
      animalId: data.animalId || "",
      animalName: animal?.name || data.animalName || "",
      title: data.title || "",
      description: data.description,
      veterinarian: data.veterinarian || "",
      clinic: data.clinic || "",
      date: data.date || "",
      time: data.time || "",
      status: "scheduled",
      notes: data.notes,
      ownerId: data.ownerId || "",
      createdAt: new Date().toISOString(),
    };
    const result = await mongo.collection("appointments").insertOne(appointment);
    return NextResponse.json({ ...appointment, id: result.insertedId.toString() }, { status: 201 });
  }

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
