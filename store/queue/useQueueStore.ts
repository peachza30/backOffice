"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";

import {
  createQueueService,
  type QueueSocketParams,
  type QueueService,
} from "@/services/queue/queue.service";

/* -------------------------------------------------------------------- */
/* Zustand state shape                                                  */
interface QueueStore {
  members: MemberEventData[];
  metadata: ApiMetadata | null;
  loading: boolean;
  error: string | null;

  /* actions */
  connect: (params?: QueueSocketParams) => void;
  disconnect: () => void;
  resend: (payload: unknown) => Promise<void>;
}

/* -------------------------------------------------------------------- */
export const useQueueStore = create<QueueStore>()(
  persist(
    subscribeWithSelector((set, get) => {
      /*  service instance ปัจจุบัน (อยู่นอก state → ไม่ trigger re-render) */
      let svc: QueueService | null = null;

      return {
        /* ---- state ----------------------------------------------------- */
        members: [],
        metadata: null,
        loading: false,
        error: null,

        /* ---- actions --------------------------------------------------- */
        connect: (params?: QueueSocketParams) => {
          if (svc) return;                        // already connected

          set({ loading: true, error: null });

          svc = createQueueService(params ?? {}, {
            onLogs: (logs, meta) =>
              set({
                members: logs,
                metadata: meta,
                loading: false,
              }),

            onLog: log =>
              set(state => ({
                members: [log, ...state.members].slice(0, 50),
              })),

            onError: err =>
              set({ error: err.message, loading: false }),
          });
          console.log("svc", svc);

        },

        disconnect: () => {
          svc?.disconnect();
          svc = null;
        },

        resend: async payload => {
          if (!svc)
            throw new Error("queue service not connected. call connect() first");
          await svc.resend(payload);
        },
      };
    }),
    {
      name: "queue-store",
      partialize: state => ({
        metadata: state.metadata, // เก็บเฉพาะ meta ใน localStorage
      }),
    },
  ),
);