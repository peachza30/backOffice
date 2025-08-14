// File: sections/RevenueSummaryCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import { Input } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/input";
import { toBuddhistDate, formatCurrency } from "@/utils/Constant";

export default function RevenueSummaryCard({ request }: { request: any }) {
  return (
    <Card className="mb-4 border-2 border-blue-100/75">
      <CardHeader className="bg-blue-50/50 m-5">
        <CardTitle className="text-md font-bold">
          <div className="flex flex-wrap justify-evenly gap-y-4">
            <div className="flex items-center gap-1">
              รายได้จากการประกอบธุรกิจคิดเป็น :<span className="font-bold ml-8">ทำบัญชี</span>
              <Input type="text" value={request?.accountingRevenue != null ? formatCurrency(request.accountingRevenue) : "0.00"} inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
              <span className="font-bold">บาท</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold ml-5">สอบบัญชี</span>
              <Input type="text" value={request?.auditingRevenue != null ? formatCurrency(request.auditingRevenue) : "0.00"} inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
              <span className="font-bold">บาท</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold ml-5">อื่นๆ</span>
              <Input type="text" value={request?.otherRevenue != null ? formatCurrency(request.otherRevenue) : "0.00"} inputMode="numeric" className="w-28 text-center" placeholder="0.00" />
              <span className="font-bold">บาท</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold mx-3">สิ้นรอบบัญชีวันที่</span>
              <span className="font-bold mx-3">:</span>
              <span className="font-bold">{request?.fiscalYearEndDate ? toBuddhistDate(request.fiscalYearEndDate) : "-"}</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
