// lib/egov.ts
import { z } from 'zod';

const EGOV_BASE = 'https://api.egov.go.th/ws';

const consumerKey = process.env.EGOV_CONSUMER_KEY!;
const consumerSecret = process.env.EGOV_CONSUMER_SECRET!;
const agentId = process.env.EGOV_AGENT_ID!;

/** -------------------------------------------------------------
 * Step 1: get Biz‑Portal token
 * ----------------------------------------------------------- */
export async function getBizToken(): Promise<string> {
   const url = new URL(`${EGOV_BASE}/auth/validate`);
   url.searchParams.set('ConsumerSecret', consumerSecret);
   url.searchParams.set('AgentID', agentId);

   const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
         'Accept': 'application/json',
         'Consumer-Key': consumerKey,
      },
      // keep the request server‑side
      cache: 'no-store',
   });

   if (!res.ok) {
      throw new Error(`Auth request failed: ${res.status} ${res.statusText}`);
   }

   // eg. { "Result": "<token>" }
   const body = await res.json();
   return body.Result as string;
}

/** -------------------------------------------------------------
 * Step 2: resolve a download URL for a given fileId / contentType
 * ----------------------------------------------------------- */
const DownloadSchema = z.object({
   data: z.string(),   // the actual download URL
});

export async function getDownloadUrl(
   
   fileId: string,
   contentType: string,
): Promise<string> {

   const token = await getBizToken();

   const url = new URL(`${EGOV_BASE}/dga/bizportal/downloadfilepath`);
   url.searchParams.set('fileid', fileId);
   url.searchParams.set('contentType', contentType);

   const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
         'Accept': 'application/json',
         'Consumer-Key': consumerKey,
         'Token': token,
      },
      cache: 'no-store',
   });

   if (!res.ok) {
      throw new Error(`Download‑path request failed: ${res.status} ${res.statusText}`);
   }

   const body = await res.json();
   const parsed = DownloadSchema.parse(body);
   return parsed.data;
}
