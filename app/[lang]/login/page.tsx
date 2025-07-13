"use client";
import Image from "next/image";
import LogInForm from "./login-form";
import auth3Light from "@/public/images/auth/auth3-light.png"
import auth3Dark from "@/public/images/auth/auth3-dark.png"
const LoginPage = () => {

  return (
    <div className="loginwrapper  flex justify-center items-center relative overflow-hidden bg-[linear-gradient(-90deg,_#F4EFFF_0%,_#FAFDFF_20%,_#E2EDFC_66%,_#D7E7FF_100%)]">
      <div className="w-full bg-background   py-5 max-w-xl  rounded-xl relative z-10 2xl:p-16 xl:p-12 p-10 m-4 ">
        <LogInForm />
      </div>
    </div>
  );
};

export default LoginPage;
