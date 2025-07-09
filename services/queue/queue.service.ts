import { io, Socket } from "socket.io-client";

/** พารามิเตอร์ที่ frontend อยากส่งขึ้นไป query log */
export interface QueueSocketParams {
  page?: number;
  perPage?: number;
}

/** callback ต่าง ๆ ที่ service จะเรียกกลับเข้าไปหา store / component */
export interface QueueServiceListeners {
  onLogs?: (logs: MemberEventData[], meta: ApiMetadata) => void;
  onLog?: (log: MemberEventData) => void;      // realtime ทีละรายการ
  onError?: (err: Error) => void;
}

/** factory สร้าง service ( 1 socket ต่อ 1 instance ) */
export function createQueueService(
  params: QueueSocketParams = {},
  listeners: QueueServiceListeners = {},
) {
  // ---- 1. สร้าง socket ---------------------------------------------------
  const socket: Socket = io(
    "https://queue-dev.tfac.or.th/socket",
    // ถ้าต้อง auth token ใส่ใน auth หรือ query ได้
    { transports: ["websocket"] },
  );

  // ---- 2. ยิง “get-webhook-logs” ทันทีเมื่อเชื่อมต่อ --------------------
  socket.on("connect", () => {
    socket.emit("get-webhook-logs", params);           // ← ส่ง page/perPage
  });

  // ---- 3. ตัวใหญ่ :  response ชุดแรก + meta (paging) --------------------
  socket.on(
    "webhook-logs",
    (packet: { data: MemberEventData[]; metadata: ApiMetadata }) => {
      listeners.onLogs?.(packet.data, packet.metadata);
    },
  );

  // ---- 4. realtime ทีละ log --------------------------------------------
  socket.on("webhook-log", (log: MemberEventData) => {
    listeners.onLog?.(log);
  });

  // ---- 5. จัดการ error ---------------------------------------------------
  socket.on("connect_error", err => listeners.onError?.(err));
  socket.on("error",          err => listeners.onError?.(err));

  // ---- 6. expose API กลับไปให้ store ------------------------------------
  return {
    /** resend ไป hit REST API — เปลี่ยน URL ตาม backend จริง */
    async resend(payload: unknown) {
      const res = await fetch(`https://queue-dev.tfac.or.th/event/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      // ขอตารางใหม่อีกที
      socket.emit("get-webhook-logs", params);
    },

    /** ดึง log ชุดใหม่เอง (ใช้กรณีเปลี่ยนหน้า ค้นหา ฯลฯ) */
    refresh(newParams: QueueSocketParams = params) {
      Object.assign(params, newParams);
      socket.emit("get-webhook-logs", params);
    },

    /** ตัดการเชื่อมต่อ */
    disconnect() {
      socket.disconnect();
    },
  };
}

export type QueueService = ReturnType<typeof createQueueService>;
