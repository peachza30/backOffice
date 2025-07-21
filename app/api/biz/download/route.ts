// app/api/biz/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDownloadUrl } from '@/lib/egov';

export async function GET(req: NextRequest) {
   const { searchParams } = new URL(req.url);
   const fileId = searchParams.get('fileId');
   const contentType = searchParams.get('contentType');

   if (!fileId || !contentType) {
      return NextResponse.json({ error: 'fileId & contentType required' }, { status: 400 });
   }

   try {
      const oneTimeUrl = await getDownloadUrl(fileId, contentType);

      // 2. pull the PDF
      const remote = await fetch(oneTimeUrl, { cache: 'no-store' });
      if (!remote.ok) {
         throw new Error(`PDF fetch failed: ${remote.status}`);
      }
      // 3. stream it back to the browser
      return new NextResponse(remote.body, {
         headers: {
            // Keep it inline so <iframe> can show it
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline',
            // and never cache on either side
            'Cache-Control': 'no-store',
         },
      });
   } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
   }
}
