import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { isMongoEnabled, getMongoDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (isMongoEnabled()) {
    const mongo = await getMongoDb();
    const user = await mongo.collection("users").findOne({ email });
    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 });
    }
    const { password: _, _id, ...safeUser } = user;
    const token = `token_${user._id}_${Date.now()}`;
    return NextResponse.json({ token, user: { id: user._id.toString(), ...safeUser } });
  }

  const db = getDB();
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 });
  }
  const { password: _, ...safeUser } = user;
  const token = `token_${safeUser.id}_${Date.now()}`;
  return NextResponse.json({ token, user: safeUser });
}
