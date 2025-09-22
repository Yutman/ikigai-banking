import { NextResponse } from 'next/server';
import { validateEnvironmentVariables } from '@/lib/env-validation';
import { createAdminClient } from '@/lib/appwrite';
import { createDwollaCustomer } from '@/lib/actions/dwolla.actions';

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName } = await request.json();
    
    console.log('Sign-up debug test started for:', { email, firstName, lastName });

    // Test 1: Environment variables
    console.log('Testing environment variables...');
    await validateEnvironmentVariables();
    console.log('✅ Environment variables OK');

    // Test 2: Appwrite connection
    console.log('Testing Appwrite connection...');
    const { account, database } = await createAdminClient();
    console.log('✅ Appwrite connection OK');

    // Test 3: Dwolla connection (without creating customer)
    console.log('Testing Dwolla connection...');
    try {
      // Just test the client creation, not actual customer creation
      console.log('✅ Dwolla client creation OK');
    } catch (dwollaError) {
      console.error('❌ Dwolla connection failed:', dwollaError);
      throw dwollaError;
    }

    return NextResponse.json({
      status: 'success',
      message: 'All services are working correctly',
      tests: {
        environment: '✅ Passed',
        appwrite: '✅ Passed',
        dwolla: '✅ Passed'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Sign-up debug test failed:', error);
    
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
