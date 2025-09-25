import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';
import { createDwollaCustomer } from '@/lib/actions/dwolla.actions';
import { validateEnvironmentVariables } from '@/lib/env-validation';
import { ID } from 'node-appwrite';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, address1, city, state, postalCode, dateOfBirth } = body;

    console.log('Fallback sign-up attempt:', { email, firstName, lastName });

    // Validate environment variables
    await validateEnvironmentVariables();

    // Create Appwrite client
    const { account, database } = await createAdminClient();

    // Create user account
    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    console.log('Appwrite account created:', newUserAccount.$id);

    // Create Dwolla customer
    const dwollaCustomerUrl = await createDwollaCustomer({
      firstName,
      lastName,
      email,
      type: 'personal',
      address1,
      city,
      state,
      postalCode,
      dateOfBirth,
    });

    console.log('Dwolla customer created:', dwollaCustomerUrl);

    // Create user document
    const newUser = await database.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.APPWRITE_USER_COLLECTION_ID!,
      ID.unique(),
      {
        userId: newUserAccount.$id,
        firstName,
        lastName,
        address1,
        city,
        state,
        postalCode,
        dateOfBirth,
        email,
        dwollaCustomerId: dwollaCustomerUrl,
        dwollaCustomerUrl,
      }
    );

    console.log('User document created:', newUser.$id);

    // Create session
    const session = await account.createEmailPasswordSession(email, password);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: newUser.$id,
        firstName,
        lastName,
        email,
      },
      session: {
        id: session.$id,
        userId: session.userId,
      }
    });

  } catch (error) {
    console.error('Fallback sign-up error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred during sign-up',
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
        }
      },
      { status: 500 }
    );
  }
}
