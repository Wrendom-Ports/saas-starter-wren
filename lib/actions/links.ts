'use server';

import crypto from 'crypto';
import { db } from '@/lib/db'; // Your starter's database connection
import { shieldedLinks } from '@/lib/db/schema'; // We will define this next
import { auth } from '@/lib/auth'; // To get the current user's email
import { getBestShield } from './picker'; 

export async function generateShieldedLink(rawUrl: string, settings: { ipLock: boolean, expiry: number }) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const bestIp = await getBestShield();
  const secret = process.env.SHIELD_SECRET;
  
  if (!secret) throw new Error("SHIELD_SECRET is missing");

  const expiryTime = Date.now() + (settings.expiry * 60 * 60 * 1000);
  const ipLockStr = settings.ipLock ? "true" : "false";

  // --- AES-256-CBC ENCRYPTION ---
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update(secret).digest(); 
  const iv = crypto.randomBytes(16); 

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(rawUrl, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const hexPayload = `${iv.toString('hex')}:${encrypted}`;

  // --- HMAC SIGNATURE ---
  const tokenPayload = `${rawUrl}:${expiryTime}:${ipLockStr}`;
  const hmac = crypto.createHmac('sha256', secret).update(tokenPayload).digest('hex');

  const shieldedUrl = `http://${bestIp}/stream_proxy.php?url=${hexPayload}&token=${hmac}&expires=${expiryTime}&ipLock=${ipLockStr}`;

  // --- NEW: SAVE TO DATABASE ---
  try {
    await db.insert(shieldedLinks).values({
      userEmail: session.user.email,
      originalUrl: rawUrl,
      shieldedUrl: shieldedUrl,
      token: hmac,
      expiryTime: expiryTime,
      ipLock: settings.ipLock,
    });
  } catch (dbError) {
    console.error("Database logging failed:", dbError);
    // We don't "throw" here so the user still gets their link even if DB is slow
  }

  return {
    url: shieldedUrl,
    node: bestIp,
    expires: new Date(expiryTime).toLocaleString()
  };
}
