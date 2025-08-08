"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import CorporateReportDataTable from "../_components/corporate-report-table/corporate-report-table";
import SizeButton from "../_components/button/size-button";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";

const CorporateList = () => {
  const { metadata, loading } = useCorporateStore();
  console.log("metadata", metadata);

  return (
    <>
      <Card title="Corporate List">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">รายงานข้อมูลนิติบุคคล</div>
          </div>
        </CardHeader>
        <CardContent>
          <CorporateReportDataTable />
        </CardContent>
      </Card>
    </>
  );
};

export default CorporateList;
