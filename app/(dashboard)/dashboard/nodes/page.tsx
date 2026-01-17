import { getNodes } from '@/lib/actions/nodes';

export default async function NodesPage() {
  const nodes = await getNodes();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Infrastructure Nodes</h1>
      
      <div className="grid gap-6">
        {nodes.map((node: any) => (
          <div key={node.id} className="p-6 border rounded-lg bg-white shadow-sm border-zinc-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{node.name || 'Ghost Node'}</h2>
              <span className={`px-2 py-1 text-xs rounded font-bold ${
                node.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {node.status.toUpperCase()}
              </span>
            </div>
            <p className="text-2xl font-mono mb-2">{node.ip}</p>
            <p className="text-gray-500 text-sm">
              Last Pulse: {new Date(node.last_seen).toLocaleString()}
            </p>
          </div>
        ))}

        {/* This placeholder only shows if the Shield IP isn't in your database yet */}
        {!nodes.some((n: any) => n.ip === '172.237.116.250') && (
          <div className="p-6 border border-dashed rounded-lg bg-gray-50 opacity-60">
            <h2 className="text-xl font-semibold text-gray-400">Shield VPS Pending</h2>
            <p className="text-sm text-gray-400">172.237.116.250</p>
          </div>
        )}
      </div>
    </div>
  );
}
