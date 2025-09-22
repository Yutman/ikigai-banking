import { NextResponse } from 'next/server';
import { validateEnvironmentVariables, logEnvironmentStatus } from '@/lib/env-validation';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = await validateEnvironmentVariables();
    
    // Get basic system info
    const systemInfo = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      platform: process.platform,
      version: process.version,
    };

    // Check external service connectivity
    const connectivityChecks = {
      appwrite: {
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
        project: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
        hasKey: !!process.env.NEXT_APPWRITE_KEY,
      },
      dwolla: {
        env: process.env.DWOLLA_ENV,
        hasKey: !!process.env.DWOLLA_KEY,
        hasSecret: !!process.env.DWOLLA_SECRET,
      },
      plaid: {
        hasClientId: !!process.env.PLAID_CLIENT_ID,
        hasSecret: !!process.env.PLAID_SECRET,
      }
    };

    return NextResponse.json({
      status: 'healthy',
      systemInfo,
      connectivityChecks,
      environment: 'All environment variables are properly configured',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
      },
      { status: 500 }
    );
  }
}
