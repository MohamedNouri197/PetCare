import { NextRequest, NextResponse } from "next/server";
import { isMongoEnabled, getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function toObjectId(id: string): ObjectId | null {
  try { return new ObjectId(id); } catch { return null; }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (isMongoEnabled()) {
    const db = await getMongoDb();
    const oid = toObjectId(params.id);
    const profile = oid
      ? await db.collection("vetProfiles").findOne({ _id: oid })
      : await db.collection("vetProfiles").findOne({ userId: params.id });
    if (!profile) return NextResponse.json({ message: "Not found" }, { status: 404 });
    const { _id, ...rest } = profile;
    return NextResponse.json({ id: _id.toString(), ...rest });
  }
  return NextResponse.json({ message: "MongoDB not configured" }, { status: 503 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  if (isMongoEnabled()) {
    const db = await getMongoDb();
    const oid = toObjectId(params.id);
    const filter = oid ? { _id: oid } : { userId: params.id };
    const result = await db.collection("vetProfiles").findOneAndUpdate(
      filter,
      { $set: data },
      { returnDocument: "after" }
    );
    if (!result) return NextResponse.json({ message: "Not found" }, { status: 404 });
    const { _id, ...rest } = result;
    return NextResponse.json({ id: _id.toString(), ...rest });
  }
  return NextResponse.json({ message: "MongoDB not configured" }, { status: 503 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (isMongoEnabled()) {
    const db = await getMongoDb();
    const oid = toObjectId(params.id);
    const filter = oid ? { _id: oid } : { userId: params.id };
    const result = await db.collection("vetProfiles").deleteOne(filter);
    if (result.deletedCount === 0) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  }
  return NextResponse.json({ message: "MongoDB not configured" }, { status: 503 });
}
