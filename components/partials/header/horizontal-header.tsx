import React from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { SiteLogo } from "@/components/svg";
import Link from "next/link";
const horizontalHeader = ({ handleOpenSearch }: { handleOpenSearch: () => void }) => {
  return (
    <div className="flex items-center lg:gap-12 gap-3 ">
      <div>
        <Link href="/dashboard" className=" text-primary flex items-center gap-2">
          <Image src={SiteLogo} alt="SiteLogo" className="h-7 w-7 text-primary" />
          <span className=" text-xl font-semibold lg:inline-block hidden"> TFAC BackOffice</span>
        </Link>
      </div>
      <button onClick={handleOpenSearch} className=" inline-flex lg:gap-2 lg:mr-0 mr-2 items-center text-default-600 text-sm">
        <span>
          <Search className=" h-4 w-4" />
        </span>
        <span className=" lg:inline-block hidden"> Search...</span>
      </button>
    </div>
  );
};

export default horizontalHeader;
