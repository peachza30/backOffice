import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from "zustand/middleware";
import * as corporate from "@/services/corporate/corporate.service";
import * as request from "@/services/corporate/request.service";
import * as requestFormType from "@/services/corporate/requestForm.service";
import * as requestStatus from "@/services/corporate/requestStatus.service";

export const useCorporateStore = create<CorporateStore>()(
  persist(
    subscribeWithSelector((set) => ({
      corporates: [],
      corporate: null,
      requests: [],
      request: null,
      requestForm: [],
      requestStatus: [],
      editList: null,
      corporateRequestById: null,
      metadata: null,
      documents: null,
      updated: null,
      loading: false,
      error: null,
      mode: null,
      remark: null,
      total: 0,

      /*--------------- Actions ---------------*/
      setMode: (mode) => set({ mode }),
      setRemark: (remark) => set({ remark }),

      /*--------------- Corporates-Requests ---------------*/
      fetchCorporateRequests: async (params) => {
        // console.log("params", params);
        set({ loading: true, error: null });
        try {
          const res = await request.findAll(params);
          set({ requests: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchCorporateRequest: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await request.findOne(params);
          set({ request: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchCorporateRequestByCorporate: async (corporateId: number) => {
        set({ loading: true, error: null });
        try {
          const res = await request.findOneByCorporate(corporateId);
          set({ requests: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchCorporateRequestForm: async () => {
        set({ loading: true, error: null });
        try {
          const res = await requestFormType.findAll();
          set({ requestForm: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchCorporateRequestStatus: async () => {
        set({ loading: true, error: null });
        try {
          const res = await requestStatus.findAll();
          set({ requestStatus: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetctRequestEditList: async () => {
        set({ loading: true, error: null });
        try {
          const res = await request.findEdit();
          set({ editList: res, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      createCorporateRequest: async (data) => {
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
      updateCorporateRequest: async (payload: CorporateUpdatePayload) => {
        set({ loading: true, error: null });
        try {
          const updated = await corporate.update(payload);
          set({ updated: updated, loading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "An unexpected error occurred",
            loading: false,
          });
        }
      },
      deleteCorporateRequest: async (id) => {
        set({ loading: true, error: null });
        try {
          await corporate.remove(id);
          // set((state) => ({
          //   corporates: state.corporates.filter((corp) => corp.id !== id),
          //   corporate: null,
          //   loading: false,
          // }));
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchCorporateDocuments: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await request.findDocs(id);
          set({ documents: res, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },

      /*--------------- Corporates-List ---------------*/
      fetchCorporatesList: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await corporate.findAll(params);
          set({ corporates: res.data, metadata: res.metadata, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      fetchCorporateListById: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await corporate.findOne(id);
          set({ corporate: res.data, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
      createCorporateList: async (data) => {
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
      updateCorporateList: async (id, data) => {
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
      deleteCorporateList: async (id) => {
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