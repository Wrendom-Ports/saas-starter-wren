'use server';

import { crypto } from 'crypto';
import { getBestShield } from './picker'; // The logic we wrote earlier

export async function generateShieldedLink(rawUrl: string, settings: { ipLock: boolean, expiry: number }) {
  // 1. Pick the best Shield VPS
  const bestIp = await getBestShield();
  
  // 2. Create the Security Token (HMAC)
  const secret = process.env.SHIELD_SECRET || 'ghost-secret-key';
  const expiryTime = Date.now() + (settings.expiry * 60 * 60 * 1000);
  
  const tokenPayload = `${rawUrl}:${expiryTime}:${settings.ipLock}`;
  const hmac = crypto.createHmac('sha256', secret).update(tokenPayload).digest('hex');
  
  // 3. Construct the Sanitized URL
  // This points to your Shield VPS stream_proxy.php
  const shieldedUrl = `http://${bestIp}/stream_proxy.php?url=${encodeURIComponent(rawUrl)}&token=${hmac}&expires=${expiryTime}`;

  return {
    url: shieldedUrl,
    node: bestIp,
    expires: new Date(expiryTime).toLocaleString()
  };
}
