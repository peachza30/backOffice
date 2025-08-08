// app/api/biz/download/route.ts
import { NextResponse } from 'next/server';

export async function GET() {

   const data =
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
                     "id": 1,
                     "name": "แปรสภาพนิติบุคคล"
                  },
                  {
                     "id": 2,
                     "name": "เปลี่ยนชื่อนิติบุคคล"
                  }
               ]
            },
            {
               "key": "address",
               "title": "ที่อยู่",
               "changes": [
                  {
                     "id": 1,
                     "name": "เปลี่ยนที่อยู่สำนักงาน"
                  },
                  {
                     "id": 2,
                     "name": "เพิ่มที่อยู่ติดต่อ"
                  }
               ]
            },
            {
               "key": "employees",
               "title": "รายนาม/พนักงาน",
               "changes": [
                  {
                     "id": 1,
                     "name": "เพิ่มกรรมการ"
                  },
                  {
                     "id": 2,
                     "name": "ลบกรรมการ"
                  }
               ]
            },
            {
               "key": "details",
               "title": "รายละเอียดหลักประกัน",
               "changes": [
                  {
                     "id": 1,
                     "name": "เปลี่ยนชื่อผู้ติดต่อ"
                  },
                  {
                     "id": 2,
                     "name": "เปลี่ยนเบอร์โทรศัพท์"
                  },
                  {
                     "id": 3,
                     "name": "เปลี่ยนอีเมล"
                  }
               ]
            },
            {
               "key": "documents",
               "title": "เอกสารในการสมัคร",
               "changes": [
                  {
                     "id": 1,
                     "name": "อัปโหลดเอกสาร"
                  },
                  {
                     "id": 2,
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

   try {
      return NextResponse.json(data);
   } catch (error) {
      console.error("Error fetching download data:", error);
      return NextResponse.json({ error: "Failed to fetch download data" }, { status: 500 });
   }
}
