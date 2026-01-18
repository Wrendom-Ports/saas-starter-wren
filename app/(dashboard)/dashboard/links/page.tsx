import { getLinkHistory } from '@/lib/actions/links';
import { Copy, ExternalLink, MousePointerClick } from 'lucide-react';

export default async function HistorySection() {
  const history = await getLinkHistory();

  return (
    <div className="mt-8 rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold leading-none tracking-tight">Recent Shielded Links</h3>
      </div>
      <div className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b transition-colors">
                <th className="h-10 px-4 text-left font-medium">Original Link</th>
                <th className="h-10 px-4 text-left font-medium">Status</th>
                <th className="h-10 px-4 text-center font-medium">Clicks</th>
                <th className="h-10 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history.map((link) => (
                <tr key={link.id} className="hover:bg-muted/50">
                  <td className="p-4 font-mono text-xs max-w-[200px] truncate">{link.originalUrl}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <MousePointerClick className="w-3 h-3" />
                      {link.clickCount}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground border">
                      <Copy className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
