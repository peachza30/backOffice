"use client";
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/[lang]/(backoffice)/(corporate)/_components/ui/card";

import SizeButton from "../../_components/button/size-button";
import CorporateView from "../../_components/corporate-tabs/corporate-tabs";

const CorporatePage = ({ params }: { params: { id: number } }) => {
  
  return (
    <>
     <Card title="Services List">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">ข้อมูลนิติบุคคล</div>
          </div>
        </CardHeader>
        <CardContent>
          <CorporateView id={params.id}/>
        </CardContent>
      </Card>
    </>
  );
};

export default CorporatePage;
