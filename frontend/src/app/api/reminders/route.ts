import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";
import { isMongoEnabled, getMongoDb } from "@/lib/mongodb";

export async function GET() {
  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const docs = await mongo.collection("reminders").find({}).sort({ date: 1 }).toArray();
    const reminders = docs.map((d) => ({ ...d, id: d._id.toString(), _id: undefined }));
    return NextResponse.json(reminders);
  }

  const db = getDB();
  const reminders = [...db.reminders].sort((a, b) => a.date.localeCompare(b.date));
  return NextResponse.json(reminders);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const reminder = {
      animalId: data.animalId,
      animalName: data.animalName,
      title: data.title || "",
      description: data.description,
      type: data.type || "other",
      date: data.date || new Date().toISOString().split("T")[0],
      time: data.time,
      recurrence: data.recurrence || "none",
      isActive: data.isActive !== false,
      createdAt: new Date().toISOString(),
    };
    const result = await mongo.collection("reminders").insertOne(reminder);
    return NextResponse.json({ ...reminder, id: result.insertedId.toString() }, { status: 201 });
  }

  const db = getDB();
  const reminder = {
    id: generateId(),
    animalId: data.animalId,
    animalName: data.animalName,
    title: data.title || "",
    description: data.description,
    type: data.type || "other",
    date: data.date || new Date().toISOString().split("T")[0],
    time: data.time,
    recurrence: data.recurrence || "none",
    isActive: data.isActive !== false,
    createdAt: new Date().toISOString(),
  };
  db.reminders.push(reminder);
  return NextResponse.json(reminder, { status: 201 });
}
