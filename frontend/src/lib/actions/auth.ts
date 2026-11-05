"use server";

import { getDB, generateId } from "@/lib/db";
import type { User, UserRole } from "@/types";

export async function loginAction(email: string, password: string): Promise<{ token: string; user: User }> {
  const db = getDB();
  const found = db.users.find((u) => u.email === email && u.password === password);
  if (!found) {
    throw new Error("Email ou mot de passe incorrect");
  }
  const { password: _, ...user } = found;
  return { token: `token_${user.id}_${Date.now()}`, user };
}

export async function registerAction(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}): Promise<{ token: string; user: User }> {
  const db = getDB();
  if (db.users.find((u) => u.email === data.email)) {
    throw new Error("Cet email est deja utilise");
  }
  const newUser = {
    id: generateId(),
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role || ("owner" as const),
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  const { password: _, ...user } = newUser;
  return { token: `token_${user.id}_${Date.now()}`, user };
}
