
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

export const data =
{
   "id": 510,
   "corporateMemberRequestId": 108986,
   "details": {
      "tabs": [
         {
            "key": "information",
            "title": "ข้อมูลนิติบุคคล",
            "changes": [
               {
                  "name": "แปรสภาพนิติบุคคล"
               },
               {
                  "name": "เปลี่ยนชื่อนิติบุคคล"
               }
            ]
         },
         {
            "key": "address",
            "title": "ที่อยู่",
            "changes": [
               {
                  "name": "เปลี่ยนที่อยู่สำนักงาน"
               },
               {
                  "name": "เพิ่มที่อยู่ติดต่อ"
               }
            ]
         },
         {
            "key": "employees",
            "title": "รายนาม/พนักงาน",
            "changes": [
               {
                  "name": "เพิ่มกรรมการ"
               },
               {
                  "name": "ลบกรรมการ"
               }
            ]
         },
         {
            "key": "details",
            "title": "รายละเอียดหลักประกัน",
            "changes": [
               {
                  "name": "เปลี่ยนชื่อผู้ติดต่อ"
               },
               {
                  "name": "เปลี่ยนเบอร์โทรศัพท์"
               },
               {
                  "name": "เปลี่ยนอีเมล"
               }
            ]
         },
         {
            "key": "documents",
            "title": "เอกสารในการสมัคร",
            "changes": [
               {
                  "name": "อัปโหลดเอกสาร"
               },
               {
                  "name": "ลบเอกสาร"
               }
            ]
         }
      ],
      "editUser": "system",
      "editDate": "2025-07-23T00:42:00.417Z"
   },
   "active": 1
}