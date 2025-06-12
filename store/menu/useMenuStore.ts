import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from "zustand/middleware";
import * as menus from "@/services/menus/menus.service"

export const useMenuStore = create<MenuStore>()(
  persist(
    subscribeWithSelector((set) => ({
      menus: [],
      menu: null,
      metadata: null,
      loading: false,
      error: null,
      iconName: null,
      isReorderMode: false,
      mode: null,

      setMode: (mode) => set({ mode }),
      setIconName: (iconName) => set({ iconName }),
      setIsReorderMode: (isReorderMode) => set({ isReorderMode }),
      getMenus: async () => {
        set({ loading: true, error: null });
        try {
          const res = await menus.findAll({});
          console.log("res", res);
          set({ menus: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      getMenu: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const res = await menus.findOne(id);
          console.log("res", res);
          set({ menu: res.data, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      createMenu: async (data) => {
        set({ loading: true, error: null });
        try {
          await menus.create(data);
          const res = await menus.findAll({});
          set({ menus: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      updateMenu: async (id, data) => {
        set({ loading: true, error: null });
        try {
          await menus.update(id, data);
          const res = await menus.findAll({});
          set({ menus: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      deleteMenu: async (id, params) => {
        set({ loading: true, error: null });
        try {
          await menus.remove(id);
          const res = await menus.findAll(params);
          set({ menus: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      }
    })),
    {
      name: 'menu-store', // unique name for localStorage key
      // Only persist the mode, not the entire state
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);