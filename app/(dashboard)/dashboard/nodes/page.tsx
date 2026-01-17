import { getNodes } from '@/lib/actions/nodes';

export default async function NodesPage() {
  const nodes = await getNodes();

  return (
    <div className="p-8 bg-zinc-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-zinc-900">Infrastructure Nodes</h1>
        <p className="text-zinc-500 mb-8">Real-time telemetry from your Ghost Network.</p>
        
        <div className="grid gap-6">
          {nodes.map((node: any) => (
            <div key={node.id} className="p-6 border rounded-xl bg-white shadow-sm border-zinc-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-800">{node.name || 'Ghost Shield'}</h2>
                  <p className="text-sm font-mono text-zinc-500">{node.ip}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                    node.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {node.status}
                  </span>
                </div>
              </div>

              {/* LIVE BANDWIDTH METER */}
              <div className="mt-6 p-4 bg-zinc-900 rounded-lg text-white">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Live Throughput</span>
                  <span className="text-sm font-mono text-blue-400 font-bold">
                    {(node.bandwidth_usage || 0).toFixed(2)} Mbps
                  </span>
                </div>
                
                {/* The Bar */}
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-in-out ${
                      node.bandwidth_usage > 800 ? 'bg-red-500' : 
                      node.bandwidth_usage > 400 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(((node.bandwidth_usage || 0) / 1000) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[9px] text-zinc-500">0 Mbps</span>
                  <span className="text-[9px] text-zinc-500">Capacity: 1 Gbps</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center border-t border-zinc-100 pt-4">
                <p className="text-zinc-400 text-[11px] italic">
                  Last Pulse: {node.last_seen ? new Date(node.last_seen).toLocaleString() : 'Never'}
                </p>
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" title="Connected"></div>
              </div>
            </div>
          ))}

          {/* Pending Shield Placeholder */}
          {!nodes.some((n: any) => n.ip === '172.237.116.250') && (
            <div className="p-6 border-2 border-dashed rounded-xl bg-zinc-100 opacity-60 flex flex-col items-center justify-center py-12">
              <h2 className="text-lg font-semibold text-zinc-400">Shield VPS Pending Pulse</h2>
              <p className="text-sm text-zinc-400 font-mono">172.237.116.250</p>
              <p className="text-[10px] mt-2 text-zinc-400 italic">Waiting for agent.py heartbeat...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
