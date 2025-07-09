// src/lib/auth/exchangeTokens.ts
import { refresh as callRefreshAPI } from './fetch-refresh'; // <– ฟังก์ชัน fetch เดิม

export interface TokenPair {
  accessToken: string;
  refreshToken?: string;         // อาจหมุนหรือไม่ก็ได้
}

export async function exchangeTokens(oldRefresh: string): Promise<TokenPair> {
  const data = await callRefreshAPI(oldRefresh); // ← คาดว่า backend ส่ง JSON
  if (!data?.accessToken) throw new Error('refresh failed');
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken, // undefined ถ้า backend ไม่หมุน
  };
}
