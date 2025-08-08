"use client";
import refreshToken from "@/hooks/refreshToken";

const TokenRefresher = () => {
  refreshToken();
  return null;
};

export default TokenRefresher;
