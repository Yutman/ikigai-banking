'use server';

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
import { ID, Query } from 'node-appwrite';
import { cookies } from 'next/headers';
import { parseStringify, encryptId, extractCustomerIdFromUrl } from '../utils';
import { Products, CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum } from 'plaid';
import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from './dwolla.actions';
import { validateEnvironmentVariables, logEnvironmentStatus } from '../env-validation';
import { withErrorHandling } from '../utils/server-action-wrapper';

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId }) 

    return parseStringify(user);
  } catch (error) {
    console.error('Error', error);
  }
}

export const signUp = async ({ password, ...userData}: SignUpParams) => {
  return withErrorHandling(async () => {
    const { email, firstName, lastName } = userData;

    console.log('Sign-up attempt started for:', { email, firstName, lastName });
    
    // Log request context for debugging
    console.log('Request context:', {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side',
      referrer: typeof window !== 'undefined' ? document.referrer : 'Server-side',
      url: typeof window !== 'undefined' ? window.location.href : 'Server-side'
    });

    try {
      // Validate all environment variables
      await validateEnvironmentVariables();
      console.log('Environment validation passed');
    } catch (envError) {
      console.error('Environment validation failed:', envError);
      await logEnvironmentStatus();
      throw new Error('Server configuration error. Please contact support.');
    }

  let newUserAccount;
  let dwollaCustomerUrl;
  let newUser;

  try {
    console.log('Starting user sign-up process...');
    
    // Step 1: Create Appwrite account
    const { account, database } = await createAdminClient();
    console.log('Creating Appwrite account...');
    
    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) {
      throw new Error('Failed to create user account in Appwrite');
    }
    console.log('Appwrite account created successfully');

    // Step 2: Create Dwolla customer
    console.log('Creating Dwolla customer...');
    dwollaCustomerUrl = await createDwollaCustomer({
      ...userData,
      type: 'personal'
    });

    if (!dwollaCustomerUrl) {
      throw new Error('Failed to create Dwolla customer - check Dwolla configuration');
    }
    console.log('Dwolla customer created successfully');

    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

    // Step 3: Create user document in Appwrite
    console.log('Creating user document...');
    newUser = await database.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl
      }
    );

    if (!newUser) {
      throw new Error('Failed to create user document in Appwrite');
    }
    console.log('User document created successfully');

    // Step 4: Create session
    console.log('Creating user session...');
    const session = await account.createEmailPasswordSession(email, password);

    if (!session) {
      throw new Error('Failed to create user session');
    }

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    console.log('User sign-up completed successfully');
    return parseStringify(newUser);

  } catch (error) {
    console.error('Sign-up error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      userData: { email, firstName, lastName },
      timestamp: new Date().toISOString(),
      errorType: error?.constructor?.name,
      errorString: String(error)
    });

    // Cleanup: If we created an Appwrite account but failed later, try to delete it
    if (newUserAccount && !newUser) {
      try {
        console.log('Attempting to cleanup failed user account...');
        await account.delete(newUserAccount.$id);
        console.log('Cleanup successful');
      } catch (cleanupError) {
        console.error('Failed to cleanup user account:', cleanupError);
      }
    }

    // Provide more specific error messages
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        cause: error.cause,
        stack: error.stack
      });

      if (error.message.includes('Dwolla')) {
        throw new Error('Payment service configuration error. Please try again later.');
      }
      if (error.message.includes('Appwrite')) {
        throw new Error('Database service error. Please try again later.');
      }
      if (error.message.includes('email')) {
        throw new Error('Email already exists. Please use a different email or sign in.');
      }
      if (error.message.includes('timeout')) {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      throw new Error(`Sign-up failed: ${error.message}`);
    }

    throw new Error('An unexpected error occurred during sign-up. Please try again.');
  }
  }, 'Sign-up');
};

export async function getLoggedInUser() {
  try {
    const sessionClient = await createSessionClient();
    if (!sessionClient) {
      console.log('No valid session client');
      return null;
    }

    const { account } = sessionClient;
    const result = await account.get();
    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    console.error('Error in getLoggedInUser:', error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete('appwrite-session');
    await account.deleteSession('current');
  } catch (error) {
    console.error('Logout error:', error);
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id
      },
      client_name: `${user.firstName} ${user.lastName}`,
      products: ['auth', 'transactions'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token })
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    )

    return parseStringify(bankAccount);
  } catch (error) {
    console.error('Error creating bank account:', error);
    return null;
  }
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    // Process all accounts
    for (const accountData of accountsResponse.data.accounts) {
      const request: ProcessorTokenCreateRequest = {
        access_token: accessToken,
        account_id: accountData.account_id,
        processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
      };

      const processorTokenResponse = await plaidClient.processorTokenCreate(request);
      const processorToken = processorTokenResponse.data.processor_token;

      const fundingSourceUrl = await addFundingSource({
        dwollaCustomerId: user.dwollaCustomerId,
        processorToken,
        bankName: accountData.name,
      });

      if (!fundingSourceUrl) throw new Error('Failed to create funding source');

      const bankAccount = await createBankAccount({
        userId: user.$id,
        bankId: itemId,
        accountId: accountData.account_id,
        accessToken,
        fundingSourceUrl,
        shareableId: encryptId(accountData.account_id),
      });

      if (!bankAccount) throw new Error('Failed to create bank account in Appwrite');
    }

    revalidatePath("/");

    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error('Exchange public token error:', error);
    return null;
  }
}

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error)
  }
}

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    )

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    )

    if(bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}