// app/api/shorten/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { createShortUrl } from '@/app/lib/db';

export const runtime = 'edge'; // 使用 Edge Runtime 以獲得更好的性能

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
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    const shortId = nanoid(8);
    const result = await createShortUrl(url, shortId);
    
    return NextResponse.json({
      success: true,
      shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${shortId}`,
      shortId
    });
  } catch (error: any) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// GET 方法用於處理選項請求
export async function GET() {
  return new NextResponse('Method not allowed', { status: 405 });
}