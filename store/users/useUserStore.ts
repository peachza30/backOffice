import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from "zustand/middleware";
import * as users from "@/services/users/users.service"

export const useUserStore = create<UserStore>()(
  persist(
    subscribeWithSelector((set) => ({
      users: [],
      user: null,
      metadata: null,
      loading: false,
      error: null,
      mode: null,
      setMode: (mode) => set({ mode }),
      fetchUsers: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await users.findAll(params);
          set({ users: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchUser: async (id: number) => {
        set({ loading: true, error: null });
        try {
          const res = await users.findOne(id);
          set({ user: res, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      createUser: async (data) => {
        // set({ loading: true, error: null });
        // try {
        //   await users.create(data);
        //   const res = await users.findAll();
        //   set({ users: res.data, metadata: res.metadata, loading: false });
        // } catch (err) {
        //   if (err instanceof Error) {
        //     set({ error: err.message, loading: false });
        //   } else {
        //     set({ error: "An unexpected error occurred", loading: false });
        //   }
        // }
      },
      updateUser: async (id, data, params) => {
        console.log(params);
        set({ loading: true, error: null });
        try {
          await users.update(id, data);
          const res = await users.findAll(params);
          set({ users: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      deleteUser: async (id, params) => {
        set({ loading: true, error: null });
        try {
          await users.remove(id);
          const res = await users.findAll(params);
          set({ users: res.data, metadata: res.metadata, loading: false });
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
      name: 'users-store', // unique name for localStorage key
      // Only persist the mode, not the entire state
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);