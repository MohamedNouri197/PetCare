import { NextRequest, NextResponse } from "next/server";
import { getDB, generateId } from "@/lib/db";
import { isMongoEnabled, getMongoDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const { email, password, firstName, lastName, role } = await req.json();

  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const existing = await mongo.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Cet email est deja utilise" }, { status: 409 });
    }
    const result = await mongo.collection("users").insertOne({
      email,
      password,
      firstName,
      lastName,
      role: role || "owner",
      createdAt: new Date().toISOString(),
    });
    const token = `token_${result.insertedId}_${Date.now()}`;
    return NextResponse.json({
      token,
      user: { id: result.insertedId.toString(), email, firstName, lastName, role: role || "owner" },
    }, { status: 201 });
  }

  const db = getDB();
  if (db.users.find((u) => u.email === email)) {
    return NextResponse.json({ message: "Cet email est deja utilise" }, { status: 409 });
  }

  const newUser = {
    id: generateId(),
    email,
    password,
    firstName,
    lastName,
    role: role || "owner",
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  const { password: _, ...safeUser } = newUser;
  const token = `token_${safeUser.id}_${Date.now()}`;
  return NextResponse.json({ token, user: safeUser }, { status: 201 });
}
