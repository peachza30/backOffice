"use client";
import React from "react";
import Image from "next/image";
import { SiteLogo } from "@/components/svg";
import { Loader2 } from "lucide-react";
const LayoutLoader = () => {
  return (
    <div className=" h-screen flex items-center justify-center flex-col space-y-2">
      <Image src={SiteLogo} alt="SiteLogo" className="h-10 w-10 text-primary" />

      <span className=" inline-flex gap-1">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </span>
    </div>
  );
};

export default LayoutLoader;
