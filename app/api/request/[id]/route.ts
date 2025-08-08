import { NextRequest, NextResponse } from 'next/server';
import { getCorpClient } from '@/lib/corpClient';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // 1) ดึง token จากคุกกี้ที่ client ส่งมา
    const token = req.cookies.get(process.env.NEXT_PUBLIC_COOKIES_NAME!)?.value
               || req.nextUrl.searchParams.get('cookie'); // fallback (ถ้ามี)

    if (!token) {
      return NextResponse.json({ error: 'Auth cookie missing' }, { status: 401 });
    }

    // 2) ใช้ client เฉพาะ request นี้
    const corpClient = getCorpClient(token);
    const { data } = await corpClient.get(`/corporate/corporate-request/${id}`);

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch request data' }, { status: 500 });
  }
}
