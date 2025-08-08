// File: sections/PeopleSection.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";
import EmployeeList from "../pages/employee-person";
import StaffAuditList from "../pages/staff-audit";

export default function PeopleSection({ personSections = [], staffSummary = [] }: { personSections: any[]; staffSummary: any[] }) {
  return (
    <>
      {personSections.map(sec => (
        <Card key={sec.type} className="mb-4 border-2 border-blue-100/75">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="font-bold">{sec.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <EmployeeList rows={sec.rows} />
          </CardContent>
        </Card>
      ))}

      {staffSummary.length > 0 && (
        <Card className="mb-4 border-2 border-blue-100/75">
          <CardHeader className="bg-blue-50/50">
            <CardTitle className="font-bold"> พนักงานที่ให้บริการงานสอบบัญชี ({staffSummary.reduce((s: number, i: any) => s + i.count, 0)})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <StaffAuditList items={staffSummary} />
          </CardContent>
        </Card>
      )}
    </>
  );
}

