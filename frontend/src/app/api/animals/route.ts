import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";
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

export async function GET(req: NextRequest) {
  if (isMongoEnabled()) {
    const db = await getMongoDb();
    const userId = req.nextUrl.searchParams.get("userId");
    const filter = userId ? { userId } : {};
    const docs = await db.collection("animals").find(filter).toArray();
    return NextResponse.json(docs.map(mapMongoAnimal));
  }

  const db = getDB();
  const userId = req.nextUrl.searchParams.get("userId");
  const animals = userId ? db.animals.filter((a) => a.ownerId === userId) : db.animals;
  return NextResponse.json(animals);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (isMongoEnabled()) {
    const db = await getMongoDb();
    const doc = {
      name: data.name || "",
      species: (data.species || "other").toUpperCase(),
      breed: data.breed || "",
      birthDate: data.birthDate || "",
      gender: (data.gender || "male").toUpperCase(),
      color: data.color || "",
      weight: data.weight || 0,
      photoUrl: data.photoUrl || null,
      chipNumber: data.microchipNumber || data.chipNumber || null,
      notes: data.notes || null,
      userId: data.ownerId || data.userId || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("animals").insertOne(doc);
    return NextResponse.json(mapMongoAnimal({ _id: result.insertedId, ...doc }), { status: 201 });
  }

  const db = getDB();
  const animal = {
    id: generateId(),
    name: data.name || "",
    species: data.species || "other",
    breed: data.breed || "",
    birthDate: data.birthDate || "",
    gender: data.gender || "male",
    color: data.color || "",
    weight: data.weight || 0,
    photoUrl: data.photoUrl,
    microchipNumber: data.microchipNumber,
    notes: data.notes,
    ownerId: data.ownerId || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.animals.push(animal);
  return NextResponse.json(animal, { status: 201 });
}
