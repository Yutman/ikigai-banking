import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const headers = request.headers;
  const userAgent = headers.get('user-agent') || '';
  
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isIOSWhatsApp = userAgent.includes('WhatsApp') && isIOS;
  const isIOSSafari = userAgent.includes('Safari') && isIOS && !userAgent.includes('Chrome');
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    device: {
      isIOS,
      isIOSWhatsApp,
      isIOSSafari,
      userAgent,
    },
    headers: {
      'user-agent': userAgent,
      'referer': headers.get('referer'),
      'origin': headers.get('origin'),
      'host': headers.get('host'),
      'x-forwarded-for': headers.get('x-forwarded-for'),
      'x-forwarded-proto': headers.get('x-forwarded-proto'),
      'x-vercel-ip-country': headers.get('x-vercel-ip-country'),
      'x-vercel-ip-region': headers.get('x-vercel-ip-region'),
      'x-vercel-ip-city': headers.get('x-vercel-ip-city'),
    },
    recommendations: {
      needsIOSFix: isIOSWhatsApp,
      shouldRefresh: isIOSWhatsApp,
      timeout: isIOSWhatsApp ? 2000 : 1000,
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isIOSWhatsApp = userAgent.includes('WhatsApp') && isIOS;
    
    console.log('iOS Debug Test:', {
      email,
      firstName,
      lastName,
      isIOS,
      isIOSWhatsApp,
      userAgent,
      timestamp: new Date().toISOString()
    });

    // Simulate the sign-up process for iOS
    if (isIOSWhatsApp) {
      console.log('iOS WhatsApp detected - applying special handling');
      
      // Add iOS-specific delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({
      status: 'success',
      message: 'iOS debug test completed',
      device: {
        isIOS,
        isIOSWhatsApp,
        userAgent,
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('iOS debug test failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      },
      { status: 500 }
    );
  }
}
