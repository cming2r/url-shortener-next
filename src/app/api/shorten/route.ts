// app/api/shorten/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createShortUrl } from '@/app/lib/db';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // 驗證 URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    const shortId = nanoid(8);
    await createShortUrl(url, shortId);
    
    return NextResponse.json({
      success: true,
      shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${shortId}`,
      shortId
    });
  } catch (error: unknown) {
    console.error('Error creating short URL:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}

// GET 方法用於處理選項請求
export async function GET() {
  return new NextResponse('Method not allowed', { status: 405 });
}