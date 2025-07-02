"use client";
import React, { use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import LogoTfac from "@/public/images/logo/tfac.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import CorporateListDataTable from "../_components/data-table/corporate-list-table";
import SizeButton from "../_components/button/size-button";
import { useCorporateStore } from "@/store/corporate/useCorporateStore";
const CorporateList = () => {
  const { metadata, fetchCorporates, loading, error, total } = useCorporateStore();
  return (
    <>
      <Card title="Corporate List">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">รายการข้อมูลนิติบุคคล ({metadata?.total})</div>
            <SizeButton />
          </div>
        </CardHeader>
        <CardContent>
          <CorporateListDataTable />
        </CardContent>
      </Card>
    </>
  );
};

export default CorporateList;
