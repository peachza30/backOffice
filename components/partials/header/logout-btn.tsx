"use client";

import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { setTimeout } from "timers/promises";

export const LogoutBtn = () => {
  const handleLogout = async () => {
    const cookieNames = [process.env.NEXT_PUBLIC_COOKIES_NAME, "token", "userId"].filter(Boolean);

    cookieNames.forEach(name => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.tfac.or.th`;
    });

    Cookies.remove(process.env.NEXT_PUBLIC_COOKIES_NAME as string);
    Cookies.remove(process.env.NEXT_PUBLIC_COOKIES_NAME as string, {
      sameSite: "Lax",
      secure: true,
      path: "/",
    });

    window.setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  return (
    <Button className="md:block hidden" variant="outline" color="destructive" onClick={handleLogout}>
      LOGOUT
    </Button>
  );
};
