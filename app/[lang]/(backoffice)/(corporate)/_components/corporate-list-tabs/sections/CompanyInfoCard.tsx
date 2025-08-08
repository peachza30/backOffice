// File: sections/CompanyInfoCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CompanyInfoCard({ corporate }: { corporate: any }) {
  return (
    <Card className="mb-4 border-2 border-blue-100/75">
      <CardHeader className="bg-blue-50/50 ">
        <CardTitle className="text-lg font-bold">ข้อมูลนิติบุคคล</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 ">
        <div className="grid grid-cols-1 gap-6">
          {[
            { label: "ประเภทนิติบุคคล", value: corporate.businessName || "-" },
            { label: "เลขประจำตัวผู้เสียภาษี", value: corporate.taxId || "-" },
            { label: "เบอร์โทรศัพท์", value: corporate.mobilePhone || "-" },
            { label: "อีเมล", value: corporate.email || "-" },
            {
              label: "สถานะนิติบุคคล",
              value: (
                <div className="flex items-center gap-2">
                  <Badge variant="soft" color={corporate.status === "1" ? "success" : "destructive"}>
                    {corporate.statusName || "-"}
                  </Badge>
                </div>
              ),
            },
            { label: "หมายเหตุ", value: corporate.remark || "-" },
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
