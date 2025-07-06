'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebhookLog {
  id: number;
  event_type: string;
  status: string;
  received_at: string;
  errorMessage?: string;
  payload: any;
  rabbitmq_id: string;
  active?: number;
}

let socket: Socket;

export default function SocketPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([]);

  useEffect(() => {
    socket = io('https://queue-dev.tfac.or.th/socket');

    socket.emit('get-webhook-logs');

    socket.on('webhook-logs', (data: WebhookLog[]) => {
      setLogs(data);
    });

    socket.on('webhook-log', (log: WebhookLog) => {
      setLogs((prev) => [log, ...prev].slice(0, 50));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const resendWebhook = async (payload: any) => {
    try {
      const res = await fetch(`https://queue-dev.tfac.or.th/event/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload }),
      });

      if (res.ok) {
        alert('✅ Webhook resent successfully');
        socket.emit('get-webhook-logs');
      } else {
        const errorText = await res.text();
        console.error('Backend error:', errorText);
        alert(`❌ Failed to resend webhook: ${errorText}`);
      }
    } catch (err) {
      console.error('Resend error:', err);
      alert('❌ Error occurred while resending webhook');
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-6 bg-gray-100 rounded-xl shadow-md font-sans text-black">
      <h1 className="text-center text-2xl font-bold mb-6 text-sky-500">📡 Webhook Logs (Realtime)</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-300 text-black">
              <th className={thClass}>Event Type</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Received At</th>
              <th className={thClass}>Error Message</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr
                key={log.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
              >
                <td className={tdClass}>{log.event_type}</td>
                <td className={tdClass}>{log.status}</td>
                <td className={tdClass}>
                  {new Date(log.received_at).toLocaleString()}
                </td>
                <td
                  className={`${tdClass} ${log.errorMessage ? 'text-red-600' : ''}`}
                >
                  {log.errorMessage || '-'}
                </td>
                <td className={tdClass}>
                  <button
                    onClick={() => resendWebhook(log.payload)}
                    disabled={log.active === 0}
                    className={`px-3 py-1 rounded text-white text-sm ${
                      log.active === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}
                  >
                    Resend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thClass =
  'px-4 py-3 text-left border-b-2 border-gray-400 font-medium text-sm';
const tdClass = 'px-4 py-2 border-b border-gray-300 text-sm';
