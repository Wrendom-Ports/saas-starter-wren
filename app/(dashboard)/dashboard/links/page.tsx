import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getLinkHistory } from '@/lib/actions/links';
import { LinkGenerator } from './link-generator'; // Adjust path if needed
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'; // Standard Wren components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, MousePointerClick, Clock } from 'lucide-react';

export default async function LinksPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const history = await getLinkHistory();

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Link Factory</h2>
      </div>

      {/* PILLAR 1: THE GENERATOR */}
      <Card className="border-blue-100 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Generate New Shielded Link</CardTitle>
        </CardHeader>
        <CardContent>
          <LinkGenerator />
        </CardContent>
      </Card>

      {/* PILLAR 2: THE HISTORY */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shielding History</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading links...</p>}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Original Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Clicks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No links found. Shield your first link above!
                    </TableCell>
                  </TableRow>
                ) : (
                  history.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-mono text-xs max-w-[300px] truncate">
                        {link.originalUrl}
                      </TableCell>
                      <TableCell>
                        {link.expiryTime > Date.now() ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                          <MousePointerClick className="h-3.5 w-3.5" />
                          {link.clickCount}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            // Note: For Client-side copy in a Server Component, 
                            // you'd usually pass this to a client child component.
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
