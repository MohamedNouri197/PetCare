import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";

export async function GET() {
  const db = getDB();
  const reminders = [...db.reminders].sort((a, b) => a.date.localeCompare(b.date));
  return NextResponse.json(reminders);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
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
