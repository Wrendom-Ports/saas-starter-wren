import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ip, status, bandwidth_usage } = body;

    // Use the environment variable directly like you do in getNodes
    const sql = neon(process.env.DATABASE_URL!);

    // Run the query using the neon client
    const result = await sql`
      INSERT INTO nodes (ip, status, bandwidth_usage, last_seen)
      VALUES (${ip}, ${status}, ${bandwidth_usage}, NOW())
      ON CONFLICT (ip) DO UPDATE 
      SET status = ${status}, bandwidth_usage = ${bandwidth_usage}, last_seen = NOW()
      RETURNING *;
    `;

    return NextResponse.json({ success: true, node: result[0] });
  } catch (error) {
    console.error('Pulse Error:', error);
    return NextResponse.json({ success: false, error: 'Database update failed' }, { status: 500 });
  }
}
