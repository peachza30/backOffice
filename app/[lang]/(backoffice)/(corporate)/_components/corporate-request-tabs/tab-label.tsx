import { useCorporateStore } from "@/store/corporate/useCorporateStore";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export const TabLabel = ({ icon, text, notify }: { icon: string; text: string; notify?: boolean }) => {
  return (
    <div className="relative flex items-center">
      <Icon icon={icon} width="24" height="24" className="mr-0 lg:mr-2" />
      <b className="hidden lg:inline">{text}</b>
      {notify && <Icon icon="tdesign:circle-filled" width="7" height="7" className="absolute -top-1 -right-2 text-orange-500" />}
    </div>
  );
};
