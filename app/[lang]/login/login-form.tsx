"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LogoTfac from "@/public/images/logo/tfac.png";

const LogInForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const AuthURL = process.env.NEXT_PUBLIC_AUTH_URL;

  useEffect(() => {
    const token = Cookies.get(process.env.NEXT_PUBLIC_COOKIES_NAME);
    if (token) {
      const localeMatch = pathname.match(/^\/(en|th)/);
      const locale = localeMatch ? localeMatch[1] : "en";

      router.replace(`/${locale}/dashboard`);
    }
  }, [pathname, router]);

  const handleLogin = async () => {
    // For external URLs, use window.location.href instead of router.push
    const azureLoginUrl = `${AuthURL}/auth/user/azure/login`;
    console.log("Redirecting to Azure AD:", azureLoginUrl);

    // Option 1: Redirect to Azure AD (external URL)
    window.location.href = azureLoginUrl;

    // Option 2: If you want to test with a fake cookie first
    // Cookies.set(process.env.NEXT_PUBLIC_COOKIES_NAME, 'test-token', {
    //   path: '/',
    //   sameSite: 'lax'
    // });
    // const localeMatch = pathname.match(/^\/(en|th)/);
    // const locale = localeMatch ? localeMatch[1] : 'en';
    // window.location.href = `/${locale}/dashboard`; // Force reload to trigger middleware
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center">
        <Image src={LogoTfac} alt="logo" className="h-20 w-20 text-primary" />
      </div>
      <div className="2xl:mt-5 mt-6 2xl:text-2xl text-2xl text-center font-bold text-default-900">TFAC BACK OFFICE SIGN UP</div>
      <Button className="w-full mt-5 p-5" onClick={handleLogin} size={!isDesktop2xl ? "lg" : "md"}>
        <Icon icon="devicon-plain:azure" className="h-5 w-5 mr-2" />
        Sign-in with Azure AD
      </Button>
      <div className="border-t  border-gray-200  mt-7">
        <div className="text-xs text-center text-orange-400 mt-3">* System Usage Recommendation: For the best experience, please use Internet Explorer 9 or higher, or access the system via Google Chrome or Mozilla Firefox.</div>
        <div className="flex justify-center items-center align-middle text-xs text-center text-blue-700  mt-2">
          <Icon icon="mdi:copyright" className="h-4 w-4 mr-1"></Icon>
          Copyright 2025 All Rights Reserved. Federation of Accounting Professions
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
