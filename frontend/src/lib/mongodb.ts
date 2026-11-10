import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";

let client: MongoClient | null = null;
let db: Db | null = null;

export function isMongoEnabled(): boolean {
  return MONGODB_URI.length > 0;
}

export async function getMongoDb(): Promise<Db> {
  if (db) return db;
  if (!MONGODB_URI) throw new Error("MONGODB_URI not set");
  client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db("petcare");
  return db;
}
