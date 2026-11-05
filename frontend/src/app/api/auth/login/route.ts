import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const db = getDB();
  const user = db.users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 });
  }
  const { password: _, ...safeUser } = user;
  const token = `token_${safeUser.id}_${Date.now()}`;
  return NextResponse.json({ token, user: safeUser });
}
