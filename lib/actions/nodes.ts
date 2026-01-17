'use server';

import { neon } from '@neondatabase/serverless';

export async function getNodes() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // SELECT * already gets bandwidth_usage and last_seen automatically
  const nodes = await sql`
    SELECT * FROM nodes 
    ORDER BY last_seen DESC
  `;

  // Safety Net: Ensure bandwidth_usage is never 'null' before sending to the UI
  return nodes.map(node => ({
    ...node,
    bandwidth_usage: node.bandwidth_usage ?? 0,
    status: node.status || 'offline'
  }));
}
