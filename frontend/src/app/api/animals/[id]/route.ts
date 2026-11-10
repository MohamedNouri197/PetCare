import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { isMongoEnabled, getMongoDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function mapMongoAnimal(doc: any) {
  const { _id, _class, ...rest } = doc;
  return {
    ...rest,
    id: _id.toString(),
    species: rest.species?.toLowerCase() || "other",
    gender: rest.gender?.toLowerCase() || "male",
    ownerId: rest.userId || rest.ownerId || "",
  };
}

function buildIdFilter(id: string) {
  try {
    return { $or: [{ _id: new ObjectId(id) }, { id }] };
  } catch {
    return { id };
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (isMongoEnabled()) {
    const db = await getMongoDb();
    const doc = await db.collection("animals").findOne(buildIdFilter(params.id));
    if (!doc) return NextResponse.json({ message: "Animal non trouve" }, { status: 404 });
    return NextResponse.json(mapMongoAnimal(doc));
  }

  const db = getDB();
  const animal = db.animals.find((a) => a.id === params.id);
  if (!animal) return NextResponse.json({ message: "Animal non trouve" }, { status: 404 });
  return NextResponse.json(animal);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();

  if (isMongoEnabled()) {
    const db = await getMongoDb();
    const update: any = { ...data, updatedAt: new Date() };
    if (update.species) update.species = update.species.toUpperCase();
    if (update.gender) update.gender = update.gender.toUpperCase();
    if (update.ownerId) { update.userId = update.ownerId; delete update.ownerId; }
    delete update.id;
    delete update._id;
    const result = await db.collection("animals").findOneAndUpdate(
      buildIdFilter(params.id),
      { $set: update },
      { returnDocument: "after" }
    );
    if (!result) return NextResponse.json({ message: "Animal non trouve" }, { status: 404 });
    return NextResponse.json(mapMongoAnimal(result));
  }

  const db = getDB();
  const idx = db.animals.findIndex((a) => a.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Animal non trouve" }, { status: 404 });
  db.animals[idx] = { ...db.animals[idx], ...data, updatedAt: new Date().toISOString() };
  return NextResponse.json(db.animals[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (isMongoEnabled()) {
    const db = await getMongoDb();
    const result = await db.collection("animals").deleteOne(buildIdFilter(params.id));
    if (result.deletedCount === 0) return NextResponse.json({ message: "Animal non trouve" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  }

  const db = getDB();
  const idx = db.animals.findIndex((a) => a.id === params.id);
  if (idx === -1) return NextResponse.json({ message: "Animal non trouve" }, { status: 404 });
  db.animals.splice(idx, 1);
  return new NextResponse(null, { status: 204 });
}
