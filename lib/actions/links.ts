'use server';

import crypto from 'crypto';
import { getBestShield } from './picker'; 

export async function generateShieldedLink(rawUrl: string, settings: { ipLock: boolean, expiry: number }) {
  // 1. Pick the best Shield VPS from your Neon Database
  const bestIp = await getBestShield();
  
  // 2. Create the Security Token (HMAC)
  const secret = process.env.SHIELD_SECRET;
  
  if (!secret) {
    throw new Error("SHIELD_SECRET is missing in Vercel Environment Variables");
  }

  const expiryTime = Date.now() + (settings.expiry * 60 * 60 * 1000);
  
  // Format the payload exactly as the Shield's PHP expects
  const ipLockStr = settings.ipLock ? "true" : "false";
  const tokenPayload = `${rawUrl}:${expiryTime}:${ipLockStr}`;
  
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(tokenPayload)
    .digest('hex');

  // 3. BASE64 ENCODE the rawUrl to hide it from the user
  const encodedUrl = Buffer.from(rawUrl).toString('base64');
  
  // 4. Construct the Sanitized URL
  // ADDED: &ipLock=${ipLockStr} so the Shield knows to enforce the lock
  const shieldedUrl = `http://${bestIp}/stream_proxy.php?url=${encodeURIComponent(encodedUrl)}&token=${hmac}&expires=${expiryTime}&ipLock=${ipLockStr}`;

  return {
    url: shieldedUrl,
    node: bestIp,
    expires: new Date(expiryTime).toLocaleString()
  };
}
