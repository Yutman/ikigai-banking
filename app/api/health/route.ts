import { NextResponse } from 'next/server';
import { validateEnvironmentVariables, logEnvironmentStatus } from '@/lib/env-validation';

export async function GET() {
  try {
    // Validate environment variables
    await validateEnvironmentVariables();
    
    return NextResponse.json({
      status: 'healthy',
      message: 'All services are properly configured',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    await logEnvironmentStatus();
    
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

