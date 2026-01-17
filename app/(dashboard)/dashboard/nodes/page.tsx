import { getNodes } from '@/lib/actions/nodes';

export default async function NodesPage() {
  const nodes = await getNodes();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Infrastructure Nodes</h1>
      
      <div className="grid gap-6">
        {nodes.map((node: any) => (
          <div key={node.id} className="p-6 border rounded-lg bg-zinc-900 border-zinc-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-zinc-100">{node.name || 'Unknown Node'}</h2>
              <span className={`px-2 py-1 text-xs rounded font-bold ${
                node.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {node.status.toUpperCase()}
              </span>
            </div>
            <p className="text-2xl font-mono mb-2 text-zinc-300">{node.ip}</p>
            <p className="text-zinc-500 text-sm">
              Last Pulse: {new Date(node.last_seen).toLocaleString()}
            </p>
          </div>
        ))}

        {/* Shield VPS Placeholder (Logic to show if 172.237.116.250 is missing) */}
        {!nodes.some((n: any) => n.ip === '172.237.116.250') && (
          <div className="p-6 border border-dashed rounded-lg bg-zinc-900/50 border-zinc-800 opacity-60">
            <h2 className="text-xl font-semibold text-zinc-500">Shield VPS Pending</h2>
            <p className="text-sm text-zinc-600 font-mono">IP: 172.237.116.250</p>
            <p className="text-xs text-zinc-500 mt-2">Waiting for heartbeat...</p>
          </div>
        )}
      </div>
    </div>
  );
}
