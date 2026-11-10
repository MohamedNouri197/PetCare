import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { isMongoEnabled, getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function toObjectId(id: string): ObjectId | null {
  try { return new ObjectId(id); } catch { return null; }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();

  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const col = mongo.collection("reminders");
    const oid = toObjectId(params.id);
    const filter = oid ? { _id: oid } : { id: params.id };
    const result = await col.findOneAndUpdate(filter, { $set: data }, { returnDocument: "after" });
    if (!result) return NextResponse.json({ message: "Rappel non trouve" }, { status: 404 });
    return NextResponse.json({ ...result, id: result._id.toString(), _id: undefined });
  }

  const db = getDB();
  const idx = db.reminders.findIndex((r) => r.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Rappel non trouve" }, { status: 404 });
  db.reminders[idx] = { ...db.reminders[idx], ...data };
  return NextResponse.json(db.reminders[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const col = mongo.collection("reminders");
    const oid = toObjectId(params.id);
    const filter = oid ? { _id: oid } : { id: params.id };
    const result = await col.deleteOne(filter);
    if (result.deletedCount === 0) return NextResponse.json({ message: "Rappel non trouve" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  }

  const db = getDB();
  const idx = db.reminders.findIndex((r) => r.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Rappel non trouve" }, { status: 404 });
  db.reminders.splice(idx, 1);
  return new NextResponse(null, { status: 204 });
}
