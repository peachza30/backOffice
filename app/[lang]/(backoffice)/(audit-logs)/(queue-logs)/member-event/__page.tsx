// app/(dashboard)/webhook-logs/page.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icon } from '@iconify/react';

/* ---------- 1. Reusable hook ---------- */
function useWebhookLogs() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  /* mount / unmount */
  useEffect(() => {
    const s = io('https://queue-dev.tfac.or.th/socket');
    setSocket(s);

    s.emit('get-webhook-logs');
    s.on('webhook-logs', (data: WebhookLog[]) => setLogs(data));
    s.on('webhook-log', (log: WebhookLog) =>
      setLogs(prev => [log, ...prev].slice(0, 50)),
    );

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, []);

  /* resend wrapper */
  const resendWebhook = useCallback(
    async (payload: unknown) => {
      try {
        const res = await fetch('https://queue-dev.tfac.or.th/event/resend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload }),
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }

        socket?.emit('get-webhook-logs');
      } catch (err: unknown) {
        console.error(err);
        alert(`❌ ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    },
    [socket],
  );

  return { logs, resendWebhook };
}

/* ---------- 2. UI component ---------- */
export default function WebhookLogsPage() {
  const { logs, resendWebhook } = useWebhookLogs();

  const statusBadge = (status: WebhookLog['status']) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge color="success">Success</Badge>;
      case 'ERROR':
        return <Badge color="destructive">Error</Badge>;
      default:
        return <Badge color="secondary">Pending</Badge>;
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="mx-auto mt-10 max-w-6xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sky-600">
            <Icon icon="mdi:webhook" className="h-6 w-6" />
            Webhook Logs (Realtime)
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Event</TableHead>
                  <TableHead className="w-32">Status</TableHead>
                  <TableHead className="w-48">Received</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {logs.map((log, i) => (
                  <TableRow key={log.id} className={i % 2 ? 'bg-muted/50' : ''}>
                    <TableCell>{log.event_type}</TableCell>
                    <TableCell>{statusBadge(log.status)}</TableCell>
                    <TableCell>
                      {new Date(log.received_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-destructive break-all">
                      {log.errorMessage ?? '-'}
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={log.active === 0}
                              onClick={() => resendWebhook(log.payload)}
                            >
                              <Icon
                                icon="mdi:reload"
                                className="mr-1 inline-block h-4 w-4"
                              />
                              Resend
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {log.active === 0
                            ? 'Already processed'
                            : 'Resend this webhook'}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
