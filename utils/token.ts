export function isTokenExpired(token: string): boolean {
   try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now(); // true = expired
   } catch (err) {
      console.warn('Invalid token format');
      return true; // treat as expired
   }
}
