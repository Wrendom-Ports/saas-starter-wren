export default function NodesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Infrastructure Nodes</h1>
      
      <div className="grid gap-6">
        {/* Main VPS */}
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Main VPS</h2>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Waiting for Agent</span>
          </div>
          <p className="text-2xl font-mono mb-2">139.162.186.62</p>
          <p className="text-gray-500 text-sm mb-4">Primary Media Storage</p>
          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
            curl -sSL https://ghostports.com/install.sh | bash
          </div>
        </div>

        {/* Shield VPS */}
        <div className="p-6 border border-dashed rounded-lg bg-gray-50 opacity-60">
          <h2 className="text-xl font-semibold text-gray-400">Shield VPS</h2>
          <p className="text-2xl font-mono text-gray-400">172.237.116.250</p>
        </div>
      </div>
    </div>
  );
}
