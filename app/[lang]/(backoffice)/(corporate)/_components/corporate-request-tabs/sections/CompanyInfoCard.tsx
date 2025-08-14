// File: sections/CompanyInfoCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CompanyInfoCard({ request }: { request: any }) {
  return (
    <Card className="mb-4 border-2 border-blue-100/75">
      <CardHeader className="bg-blue-50/50 ">
        <CardTitle className="text-lg font-bold">ข้อมูลนิติบุคคล</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 ">
        <div className="grid grid-cols-1 gap-6">
          {[
            { label: "ประเภทนิติบุคคล", value: request?.corporateServiceName || "-" },
            { label: "เลขประจำตัวผู้เสียภาษี", value: request?.registrationNo || "-" },
            { label: "เบอร์โทรศัพท์", value: request?.mobilePhone || "-" },
            { label: "อีเมล", value: request?.email || "-" },
            {
              label: "สถานะนิติบุคคล",
              value: (
                <div className="flex items-center gap-2">
                  <Badge variant="soft" color={request?.status === "1" ? "success" : "destructive"}>
                    {request?.statusName || "-"}
                  </Badge>
                </div>
              ),
            },
            { label: "หมายเหตุ", value: request?.remark || "-" },
          ].map(({ label, value }) => (
            <div className="flex items-start gap-4" key={label}>
              <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "140px", minWidth: "140px" }}>
                {label}
              </label>
              <p className="text-sm text-gray-900 p-2 rounded flex-1">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
