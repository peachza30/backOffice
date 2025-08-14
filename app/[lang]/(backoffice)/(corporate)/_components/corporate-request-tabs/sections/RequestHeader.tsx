// File: sections/RequestHeader.tsx
import React from "react";
import { CardContent } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RequestHeader({ request }: { request: any }) {
  return (
    <div className="bg-blue-50/40">
      <div className="flex justify-center items-center text-md">
        <span className="font-bold">เลขที่คำขอ</span>
        <span className="font-bold pl-3">:</span>
        <span className="pl-3">{request?.no}</span>
      </div>
      <CardContent className="p-8">
        <div className="">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              { label: "ประเภทคำขอ", value: request?.nameTh || "-" },
              { label: "วันที่ยื่นคำขอ", value: request?.nameEn || "-" },
              { label: "วันที่รับเอกสาร", value: request?.registrationNo || "-" },
              {
                label: "สถานะคำขอ",
                value: (
                  <Badge variant="soft" color="warning">{request?.requestStatusName || "-"}</Badge>
                ),
              },
            ].map(({ label, value }) => (
              <div className="flex items-start gap-4" key={label}>
                <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "140px", minWidth: "140px" }}>
                  {label}
                </label>
                <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-blue-50/40">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: "ชื่อนิติบุคคล", value: request?.nameTh || "-" },
              { label: "ชื่อภาษาอังกฤษ", value: request?.nameEn || "-" },
              { label: "เลขทะเบียนนิติบุคคล", value: request?.registrationNo || "-" },
              { label: "ประเภทการให้บริการ", value: request?.serviceTypeName || "-" },
            ].map(({ label, value }) => (
              <div className="flex items-start gap-4" key={label}>
                <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "140px", minWidth: "140px" }}>
                  {label}
                </label>
                <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  );
}
