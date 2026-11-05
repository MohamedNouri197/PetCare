import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const animal = db.animals.find((a) => a.id === params.id);
  if (!animal) return NextResponse.json({ message: "Animal non trouve" }, { status: 404 });
  return NextResponse.json(animal);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const idx = db.animals.findIndex((a) => a.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Animal non trouve" }, { status: 404 });
  const data = await req.json();
  db.animals[idx] = { ...db.animals[idx], ...data, updatedAt: new Date().toISOString() };
  return NextResponse.json(db.animals[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDB();
  const idx = db.animals.findIndex((a) => a.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Animal non trouve" }, { status: 404 });
  db.animals.splice(idx, 1);
  return new NextResponse(null, { status: 204 });
}
