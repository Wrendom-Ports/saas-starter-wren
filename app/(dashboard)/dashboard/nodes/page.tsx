import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NodesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Infrastructure</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Main VPS Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main VPS</CardTitle>
            <Badge variant="outline" className="text-yellow-500 border-yellow-500">
              Waiting for Agent
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-mono">139.162.186.62</div>
            <p className="text-xs text-muted-foreground mt-1">
              Location: Primary Media Hub
            </p>
            <div className="mt-4 p-2 bg-black rounded text-[10px] text-green-400 font-mono overflow-x-auto">
              curl -sSL https://ghostports.com/install.sh | bash
            </div>
          </CardContent>
        </Card>

        {/* Shield VPS Placeholder */}
        <Card className="opacity-50 border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shield VPS</CardTitle>
            <Badge variant="secondary">Pending Setup</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">172.237.116.250</div>
            <p className="text-xs text-muted-foreground mt-1">
              Status: Not Connected
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
