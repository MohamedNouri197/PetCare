import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const idx = db.appointments.findIndex((a) => a.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "RDV non trouve" }, { status: 404 });
  const data = await req.json();
  db.appointments[idx] = { ...db.appointments[idx], ...data };
  return NextResponse.json(db.appointments[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const idx = db.appointments.findIndex((a) => a.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "RDV non trouve" }, { status: 404 });
  db.appointments.splice(idx, 1);
  return new NextResponse(null, { status: 204 });
}
