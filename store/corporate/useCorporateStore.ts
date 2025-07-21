import { create } from "zustand";
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from "zustand/middleware";
import * as corporate from "@/services/corporate/corporate.service";
import * as request from "@/services/corporate/request.service";
import * as requestFormType from "@/services/corporate/requestForm.service";

export const useCorporateStore = create<CorporateStore>()(
  persist(
    subscribeWithSelector((set) => ({
      corporates: [],
      corporate: null,
      requests: [],
      request: null,
      requestForm: [],
      corporateRequestById: null,
      metadata: null,
      documents: [],
      loading: false,
      error: null,
      mode: null,
      total: 0,

      setMode: (mode) => set({ mode }),

      fetchCorporateRequests: async (params) => {
        set({ loading: true, error: null });
        try {
          const res = await request.findAll(params);
          console.log("res", res);
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
      updateCorporateRequest: async (id, data) => {
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
      deleteCorporateRequest: async (id) => {
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
      fetchCorporateDocuments: async () => {
        set({ loading: true, error: null });
        try {
          const data = [
            {
              id: 1,
              type: "หนังสือรับรองการจดทะเบียนนิติบุคคล ไม่เกิน 3 เดือน",
              count: 10,
              date: "2023-10-01",
              fileId: "6600f271d2babd2cd8a77ece",
            },
            {
              id: 2,
              type: "สำเนาบัตรประจำตัวประชาชนของกรรมการ/หุ้นส่วนผู้จัดการผู้มีอำนาจลงนาม",
              count: 5,
              date: "2023-10-02",
              fileId: "66b31f10fc70cdde2d64fc90",
            },
            {
              id: 3,
              type: "งบการเงินย้อนหลัง3ปี",
              count: 3,
              date: "2023-10-03",
              fileId: "66b31f05fc70cdde2d64fc8c",
            },
            {
              id: 4,
              type: "ข้อมูลในงบกำไรขาดทุน หรือสำเนางบการเงิน ย้อนหลัง 1 ปี กรณีเป็นนิติบุคคลที่จดทะเบียนกับสภาวิชาชีพบัญชีครั้งแรก (ถ้ามี)",
              count: 1,
              date: "2023-05-11",
              fileId: "6600f271d2babd2cd8a77ece",
            },
            {
              id: 5,
              type: "สำเนาหลักประกัน",
              count: 2,
              date: "2023-05-11",
              fileId: "66b31f10fc70cdde2d64fc90",
            },
            {
              id: 6,
              type: "สำเนางบการเงินของปีก่อน (กรณีที่งบการเงินล่าสุดยังไม่ได้ตรวจสอบและแสดงความเห็น โดยผู้สอบบัญชี)",
              count: 1,
              date: "2023-05-11",
              fileId: "6600f1b3d2babd2cd8a77e42",
            },
          ];
          set({ documents: data, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
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
          // const bId = res.data.businessTypeId;
          // const type = await businessType.findOne(bId);
          // console.log("type", type);

          set({ corporate: res.data, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
/*************  ✨ Windsurf Command ⭐  *************/
/*******  c3e60cef-3453-43b4-b65e-ebd7e766a4d9  *******/
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