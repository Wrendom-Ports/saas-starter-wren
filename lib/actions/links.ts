'use server';

import crypto from 'crypto';
import { getBestShield } from './picker'; 

export async function generateShieldedLink(rawUrl: string, settings: { ipLock: boolean, expiry: number }) {
  const bestIp = await getBestShield();
  const secret = process.env.SHIELD_SECRET;
  
  if (!secret) throw new Error("SHIELD_SECRET is missing");

  const expiryTime = Date.now() + (settings.expiry * 60 * 60 * 1000);
  const ipLockStr = settings.ipLock ? "true" : "false";

  // --- NEW: AES-256-CBC ENCRYPTION ---
  const algorithm = 'aes-256-cbc';
  // We hash the secret to ensure it's exactly 32 bytes for the AES key
  const key = crypto.createHash('sha256').update(secret).digest(); 
  const iv = crypto.randomBytes(16); // Random IV makes the URL unique every time

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(rawUrl, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Combine IV and Encrypted data with a colon
  const hexPayload = `${iv.toString('hex')}:${encrypted}`;

  // Use the RAW URL for the HMAC signature so the Shield can verify it after decryption
  const tokenPayload = `${rawUrl}:${expiryTime}:${ipLockStr}`;
  const hmac = crypto.createHmac('sha256', secret).update(tokenPayload).digest('hex');

  const shieldedUrl = `http://${bestIp}/stream_proxy.php?url=${hexPayload}&token=${hmac}&expires=${expiryTime}&ipLock=${ipLockStr}`;

  return {
    url: shieldedUrl,
    node: bestIp,
    expires: new Date(expiryTime).toLocaleString()
  };
}
