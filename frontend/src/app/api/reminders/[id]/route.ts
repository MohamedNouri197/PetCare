import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const idx = db.reminders.findIndex((r) => r.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Rappel non trouve" }, { status: 404 });
  const data = await req.json();
  db.reminders[idx] = { ...db.reminders[idx], ...data };
  return NextResponse.json(db.reminders[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const idx = db.reminders.findIndex((r) => r.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Rappel non trouve" }, { status: 404 });
  db.reminders.splice(idx, 1);
  return new NextResponse(null, { status: 204 });
}
