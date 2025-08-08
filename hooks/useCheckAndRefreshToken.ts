// hooks/useCheckAndRefreshToken.ts
/**
 * เรียก /auth/refresh เพื่อ refresh token จาก server
 * server จะใช้ cookie เดิม (httpOnly) เพื่อออก token ใหม่
 */

import { useEffect } from 'react';
import axios from 'axios';


const useCheckAndRefreshToken = () => {
   useEffect(() => {
      const refreshToken = async () => {
         try {
            // ✅ สำคัญ: เพื่อให้ cookie httpOnly แนบไปด้วย
            const res = await axios.get('https://auth-dev.tfac.or.th/auth/refresh', {
               withCredentials: true,
            });
               console.log("res", res);

            if (res.status === 200) {
               console.log('✅ Token refreshed from server.');
               // คุณอาจจะเก็บข้อมูลเพิ่มเติมจาก res.data ถ้ามี
            } else {
               console.warn('⚠️ Unable to refresh token. Possibly expired session.');
            }
         } catch (err) {
            console.error('🔴 Token refresh error:', err);
            // TODO: redirect ไป login หรือทำ logout
         }
      };

      refreshToken();
   }, []);
};

export default useCheckAndRefreshToken;
