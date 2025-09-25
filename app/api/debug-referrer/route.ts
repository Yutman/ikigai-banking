import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const headers = request.headers;
  const url = request.url;
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    url: url,
    headers: {
      'user-agent': headers.get('user-agent'),
      'referer': headers.get('referer'),
      'origin': headers.get('origin'),
      'host': headers.get('host'),
      'x-forwarded-for': headers.get('x-forwarded-for'),
      'x-forwarded-proto': headers.get('x-forwarded-proto'),
      'x-vercel-ip-country': headers.get('x-vercel-ip-country'),
      'x-vercel-ip-region': headers.get('x-vercel-ip-region'),
      'x-vercel-ip-city': headers.get('x-vercel-ip-city'),
    },
    searchParams: Object.fromEntries(new URL(url).searchParams),
    isWhatsApp: headers.get('user-agent')?.includes('WhatsApp') || false,
    isMobile: headers.get('user-agent')?.includes('Mobile') || false,
  });
}
