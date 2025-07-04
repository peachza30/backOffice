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
      documents: [],
      loading: false,
      error: null,
      mode: null,
      total: 0,

      setMode: (mode) => set({ mode }),
      fetchCorporateDocuments: async () => {
        set({ loading: true, error: null });
        try {
          const data = [
            {
              id: 1,
              type: "หนังสือรับรองการจดทะเบียนนิติบุคคล ไม่เกิน 3 เดือน",
              count: 10,
              date: "2023-10-01",
              file: "/files/TAS_21_revised_2568.pdf",
            },
            {
              id: 2,
              type: "สำเนาบัตรประจำตัวประชาชนของกรรมการ/หุ้นส่วนผู้จัดการผู้มีอำนาจลงนาม",
              count: 5,
              date: "2023-10-02",
              file: "/files/TFRS 18_2568.pdf",
            },
            {
              id: 3,
              type: "งบการเงินย้อนหลัง3ปี",
              count: 3,
              date: "2023-10-03",
              file: "/files/TFRS 19_2568.pdf",
            },
            {
              id: 4,
              type: "ข้อมูลในงบกำไรขาดทุน หรือสำเนางบการเงิน ย้อนหลัง 1 ปี กรณีเป็นนิติบุคคลที่จดทะเบียนกับสภาวิชาชีพบัญชีครั้งแรก (ถ้ามี)",
              count: 1,
              date: "2023-05-11",
              file: "/files/TFRS_1_revised_2568.pdf",
            },
            {
              id: 5,
              type: "สำเนาหลักประกัน",
              count: 2,
              date: "2023-05-11",
              file: "/files/TAS_21_revised_2568.pdf",
            },
            {
              id: 6,
              type: "สำเนางบการเงินของปีก่อน (กรณีที่งบการเงินล่าสุดยังไม่ได้ตรวจสอบและแสดงความเห็น โดยผู้สอบบัญชี)",
              count: 1,
              date: "2023-05-11",
              file: "/files/TFRS 18_2568.pdf",
            },
          ];
          console.log("res", data);
          set({ documents: data, loading: false });
        } catch (err) {
          if (err instanceof Error) {
            set({ error: err.message, loading: false });
          } else {
            set({ error: "An unexpected error occurred", loading: false });
          }
        }
      },
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