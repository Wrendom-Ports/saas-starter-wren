'use server';

import { neon } from '@neondatabase/serverless';

export async function getNodes() {
  const sql = neon(process.env.DATABASE_URL!);
  const nodes = await sql`SELECT * FROM nodes ORDER BY last_seen DESC`;
  return nodes;
}
