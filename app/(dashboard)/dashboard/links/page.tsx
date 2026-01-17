'use client';

import { useState } from 'react';
import { generateShieldedLink } from '@/lib/actions/links';

export default function LinkFactory() {
  const [rawUrl, setRawUrl] = useState('');
  const [shieldedUrl, setShieldedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateShieldedLink(rawUrl, { ipLock: true, expiry: 24 });
    setShieldedUrl(result.url);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* ZONE 1: THE LINK FACTORY (Top) */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-white">Link Factory</h2>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Paste Raw Destination URL (e.g. s3://my-bucket/file.mp4)"
            className="w-full bg-slate-800 border-slate-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={rawUrl}
            onChange={(e) => setRawUrl(e.target.value)}
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            {loading ? 'Generating Shield...' : 'Generate Sanitized Link'}
          </button>
        </div>

        {shieldedUrl && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg animate-in fade-in slide-in-from-top-4">
            <p className="text-xs text-green-400 font-mono mb-2">SHIELDED URL READY:</p>
            <div className="flex gap-2">
              <input readOnly value={shieldedUrl} className="w-full bg-black/40 p-2 rounded font-mono text-sm text-white" />
              <button 
                onClick={() => navigator.clipboard.writeText(shieldedUrl)}
                className="bg-slate-700 px-4 rounded text-white text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ZONE 2: ANALYTICS CARDS (Middle) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">Active Shields</p>
          <p className="text-2xl font-bold text-white">2 / 5</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">Total Bandwidth</p>
          <p className="text-2xl font-bold text-blue-400">1.2 Gbps</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <p className="text-slate-400 text-sm">Links Revoked</p>
          <p className="text-2xl font-bold text-red-400">0</p>
        </div>
      </div>
    </div>
  );
}
