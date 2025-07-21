"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SizeButton from "../_components/button/size-button";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import CorporateRequestDataTable from "../_components/corporate-request-table/corporate-request-table";
const CorporateList = () => {
  const { metadata } = useCorporateStore();
  return (
    <>
      <Card title="Corporate List">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">รายการคำขอนิติบุคคล ({metadata?.total})</div>
            <SizeButton />
          </div>
        </CardHeader>
        <CardContent>
          <CorporateRequestDataTable />
        </CardContent>
      </Card>
    </>
  );
};

export default CorporateList;
