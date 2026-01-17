import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // This catches the data sent from your agent.py script
    const { ip, status, bandwidth_usage } = body;

    const query = `
      INSERT INTO nodes (ip, status, bandwidth_usage, last_seen)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (ip) DO UPDATE 
      SET status = $2, bandwidth_usage = $3, last_seen = NOW()
      RETURNING *;
    `;

    const result = await db.query(query, [ip, status, bandwidth_usage]);

    return NextResponse.json({ success: true, node: result.rows[0] });
  } catch (error) {
    console.error('Pulse Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
