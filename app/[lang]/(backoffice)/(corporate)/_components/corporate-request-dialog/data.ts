
/* ---------- types ---------- */
export interface DetailItem {
   id: number;
   name: string;
}
export interface DetailsGroup {
   corporate: DetailItem[];
   employee: DetailItem[];
   address: DetailItem[];
}

export interface DetailItem {
   id: number; // unique **ทั่วทั้งโปรเจกต์** ไม่ซ้ำระหว่างหมวด
   name: string; // ป้ายชื่อ (TH/EN ก็ได้)
}
export interface DetailsGroup {
   corporate: DetailItem[];
   employee: DetailItem[];
   address: DetailItem[];
}

export const data: DetailsGroup[] = [
   {
      corporate: [
         { id: 1, name: "แปรสภาพนิติบุคคล" },
         { id: 2, name: "ชื่อนิติบุคคล" },
         { id: 3, name: "ประเภทงานให้บริการ" },
         { id: 4, name: "ทุนจดทะเบียน" },
         { id: 5, name: "ขอให้ออกหนังสือรับรองใหม่" },
      ],
      employee: [
         { id: 1, name: "รายนามกรรมการ" },
         { id: 2, name: "รายนามหัวหน้าสำนักงาน" },
         { id: 3, name: "รายนามผู้ทำบัญชี" },
         { id: 4, name: "รายนามผู้สอบบัญชี" },
         { id: 5, name: "จำนวนพนักงาน" },
      ],
      address: [
         { id: 1, name: "ที่อยู่" },
         { id: 2, name: "ที่อยู่สาขา" },
      ],
   },
];