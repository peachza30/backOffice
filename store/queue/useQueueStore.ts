// // ── store/queue/useQueueStore.ts ───────────────────────────────────
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { subscribeWithSelector } from 'zustand/middleware';

// import * as queueService from '@/services/queue/queue.service'; // ← adjust to your path

// export const useQueueStore = create<QueueStore>()(
//    persist(
//       subscribeWithSelector((set) => ({
//          // --- state ---------------------------------------------------
//          members: [] as QueueStore['members'],
//          member: null,
//          metadata: null,
//          mode: null,
//          loading: false,
//          error: null,

//          // --- actions -------------------------------------------------
//          setMode: (mode) => set({ mode }),

//          fetchMembers: async () => {
//             set({ loading: true, error: null });
//             try {
//                    const s = io('https://queue-dev.tfac.or.th/socket');

//                set({
//                   members: res.data,        // MemberEvent[]
//                   metadata: res.metadata,    // ApiMetadata
//                   loading: false,
//                });
//             } catch (err) {
//                set({
//                   error: err instanceof Error ? err.message : 'Unexpected error',
//                   loading: false,
//                });
//             }
//          },

//          fetchMember: async (id: number) => {
//             set({ loading: true, error: null });
//             try {
//                const res = await queueService.findOne(id);
//                set({ member: res.data, loading: false });
//             } catch (err) {
//                set({
//                   error: err instanceof Error ? err.message : 'Unexpected error',
//                   loading: false,
//                });
//             }
//          },
//       })),
//       {
//          name: 'queue-store',
//          // Persist only what you really need; here just `mode`
//          partialize: (state) => ({ mode: state.mode }),
//       },
//    ),
// );
