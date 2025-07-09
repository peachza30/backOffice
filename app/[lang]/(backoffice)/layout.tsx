import DashBoardLayoutProvider from "@/provider/dashboard.layout.provider";
import { getDictionary } from "@/app/dictionaries";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";

const layout = async ({ children, params: { lang } }: { children: React.ReactNode; params: { lang: any } }) => {
  const trans = await getDictionary(lang);
  return <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>;
  // <html lang={lang}>
  //   <bo suppressHydrationWarning>
  //     {" "}
  {
    /* ลูกไม้ป้องกัน flash theme */
  }
  // <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>
  //   </bo
};

export default layout;
