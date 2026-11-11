import { NextRequest, NextResponse } from "next/server";
import { isMongoEnabled, getMongoDb } from "@/lib/mongodb";

function mapDoc(doc: Record<string, unknown>) {
  const { _id, ...rest } = doc;
  return { id: _id?.toString(), ...rest };
}

export async function GET() {
  if (isMongoEnabled()) {
    const db = await getMongoDb();
    const profiles = await db.collection("vetProfiles").find({}).toArray();
    return NextResponse.json(profiles.map(mapDoc));
  }
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (isMongoEnabled()) {
    const db = await getMongoDb();
    const profile = {
      userId: data.userId || "",
      name: data.name || "",
      specialty: data.specialty || "Generaliste",
      clinic: data.clinic || "",
      address: data.address || "",
      phone: data.phone || "",
      availableDays: data.availableDays || [1, 2, 3, 4, 5],
      slotDuration: data.slotDuration || 30,
      workStart: data.workStart || "09:00",
      workEnd: data.workEnd || "18:00",
      createdAt: new Date().toISOString(),
    };

    const existing = await db.collection("vetProfiles").findOne({ userId: profile.userId });
    if (existing) {
      await db.collection("vetProfiles").updateOne(
        { userId: profile.userId },
        { $set: profile }
      );
      return NextResponse.json({ id: existing._id.toString(), ...profile });
    }

    const result = await db.collection("vetProfiles").insertOne(profile);
    return NextResponse.json({ id: result.insertedId.toString(), ...profile }, { status: 201 });
  }

  return NextResponse.json({ message: "MongoDB not configured" }, { status: 503 });
}
