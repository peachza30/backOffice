import axios from 'axios';
import Cookies from 'js-cookie';

const refreshToken = () => {
   const checkAndRefresh = async () => {
      const token = Cookies.get(process.env.NEXT_PUBLIC_COOKIES_NAME as string) || '';

      if (!token) {
         console.warn('No access token found.');
         return;
      }

      try {
         const tokenPayload = JSON.parse(atob(token.split('.')[1]));
         const isExpired = tokenPayload.exp * 1000 < Date.now();

         if (isExpired) {
            console.warn('Access token is expired. Attempting to refresh...');
            const res = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/auth/refresh`, {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            });

            if (res?.data?.accessToken) {
               const cookieNames = [process.env.NEXT_PUBLIC_COOKIES_NAME, "token", "userId"].filter(Boolean);

               cookieNames.forEach(name => {
                  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.tfac.or.th`;
               });

               Cookies.remove(process.env.NEXT_PUBLIC_COOKIES_NAME as string, {
                  sameSite: "Lax",
                  secure: true,
                  path: "/",
               });

               Cookies.set(process.env.NEXT_PUBLIC_COOKIES_NAME, res.data.accessToken);

               console.log('Access token refreshed successfully.');
            } else {
               console.warn('No access token returned from refresh.');
            }
         } else {
            console.log('Access token is still valid.');
         }
      } catch (err) {
         console.error('Error parsing token or refreshing:', err);
      }
   };

   checkAndRefresh();
};

export default refreshToken;
