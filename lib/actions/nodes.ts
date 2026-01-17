'use server';

import { neon } from '@neondatabase/serverless';

export async function getNodes() {
  const sql = neon(process.env.DATABASE_URL!);
  
  const nodes = await sql`
    SELECT * FROM nodes 
    ORDER BY last_seen DESC
  `;

  // Ensures the UI always receives a number, even if DB is null
  return nodes.map(node => ({
    ...node,
    bandwidth_usage: node.bandwidth_usage ?? 0,
    status: node.status || 'offline'
  }));
}
