import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from "zustand/middleware";
import * as corporate from "@/services/corporate/corporate.service";

export const useCorporateStore = create<CorporateStore>()(
  persist(
    subscribeWithSelector((set) => ({
      corporates: [],
      corporate: null,
      metadata: null,
      loading: false,
      error: null,
      mode: null,
      total: 0,
      setMode: (mode) => set({ mode }),
      fetchCorporates: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await corporate.findAll(params);

          console.log("res", res);
          set({ corporates: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchCorporateById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await corporate.findOne(id);
          console.log("res", res);
          set({ corporate: res, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      createCorporate: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await corporate.create(data);
          set((state) => ({
            corporates: [...state.corporates, res.data],
            corporate: res.data,
            loading: false,
          }));
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      updateCorporate: async (id, data) => {
        set({ loading: true, error: null });
        try {
          const res = await corporate.update(id, data);
          set((state) => ({
            corporates: state.corporates.map((corp) =>
              corp.id === id ? res.data : corp
            ),
            corporate: res.data,
            loading: false,
          }));
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      deleteCorporate: async (id) => {
        set({ loading: true, error: null });
        try {
          await corporate.remove(id);
          set((state) => ({
            corporates: state.corporates.filter((corp) => corp.id !== id),
            corporate: null,
            loading: false,
          }));
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
    })),
    {
      name: 'service-store', // unique name for localStorage key
      // Only persist the mode, not the entire state
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);