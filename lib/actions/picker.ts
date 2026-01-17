'use server';

import { neon } from '@neondatabase/serverless';

export async function getBestShield() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // We look for online nodes, ordered by lowest bandwidth first
  const nodes = await sql`
    SELECT ip FROM nodes 
    WHERE status = 'online' 
    ORDER BY bandwidth_usage ASC 
    LIMIT 1
  `;

  // Fallback to your primary Shield if the DB is empty or nodes are offline
  return nodes[0]?.ip || '172.237.116.250';
}
