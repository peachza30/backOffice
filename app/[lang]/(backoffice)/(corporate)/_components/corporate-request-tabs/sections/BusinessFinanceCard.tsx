// File: sections/BusinessFinanceCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { formatCurrency } from "@/utils/Constant";

export default function BusinessFinanceCard({ request }: { request: any }) {
  return (
    <Card className="mb-4 border-2 border-blue-100/75">
      <CardHeader className="bg-blue-50/50">
        <CardTitle className="text-lg font-bold">ข้อมูลทางธุรกิจและการเงิน</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-1 gap-6">
          {[{ label: "เงินทุนจดทะเบียน", value: request?.capital ? formatCurrency(request.capital) : "-" }].map(({ label, value }) => (
            <div className="flex items-start gap-4" key={label}>
              <label className="block text-sm font-bold text-gray-700 pt-2" style={{ width: "140px", minWidth: "140px" }}>
                {label}
              </label>
              <p className="text-sm text-gray-900 p-2 rounded flex-1">
                {value} <span className="text-sm text-gray-900 p-2 rounded flex-1 font-bold ml-16">บาท</span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
