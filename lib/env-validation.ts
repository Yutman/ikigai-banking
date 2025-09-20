'use server';

/**
 * Validates all required environment variables for the application
 * This should be called at startup to ensure all services are properly configured
 */
export async function validateEnvironmentVariables() {
  const requiredVars = {
    // Appwrite
    NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    NEXT_PUBLIC_APPWRITE_PROJECT: process.env.NEXT_PUBLIC_APPWRITE_PROJECT,
    NEXT_APPWRITE_KEY: process.env.NEXT_APPWRITE_KEY,
    APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: process.env.APPWRITE_USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: process.env.APPWRITE_BANK_COLLECTION_ID,
    
    // Dwolla
    DWOLLA_ENV: process.env.DWOLLA_ENV,
    DWOLLA_KEY: process.env.DWOLLA_KEY,
    DWOLLA_SECRET: process.env.DWOLLA_SECRET,
    
    // Plaid
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
  };

  const missingVars: string[] = [];
  
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your Vercel environment variables configuration.'
    );
  }

  // Validate Dwolla environment
  if (!['sandbox', 'production'].includes(process.env.DWOLLA_ENV || '')) {
    throw new Error('DWOLLA_ENV must be either "sandbox" or "production"');
  }

  console.log('✅ All environment variables are properly configured');
  return true;
}

/**
 * Logs environment configuration status (without exposing sensitive values)
 */
export async function logEnvironmentStatus() {
  console.log('🔧 Environment Configuration Status:');
  console.log(`- Appwrite Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ? '✅ Set' : '❌ Missing'}`);
  console.log(`- Appwrite Project: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT ? '✅ Set' : '❌ Missing'}`);
  console.log(`- Appwrite Key: ${process.env.NEXT_APPWRITE_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`- Database ID: ${process.env.APPWRITE_DATABASE_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`- User Collection: ${process.env.APPWRITE_USER_COLLECTION_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`- Bank Collection: ${process.env.APPWRITE_BANK_COLLECTION_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`- Dwolla Environment: ${process.env.DWOLLA_ENV || '❌ Missing'}`);
  console.log(`- Dwolla Key: ${process.env.DWOLLA_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`- Dwolla Secret: ${process.env.DWOLLA_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`- Plaid Client ID: ${process.env.PLAID_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`- Plaid Secret: ${process.env.PLAID_SECRET ? '✅ Set' : '❌ Missing'}`);
}

