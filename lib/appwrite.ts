'use server';

import { Client, Account, Users, Databases } from 'node-appwrite';
import { cookies } from 'next/headers';

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const sessionCookie = cookies().get('appwrite-session');
  if (!sessionCookie || !sessionCookie.value) {
    console.log('No session cookie found');
    return null; // Return null if no session
  }

  try {
    client.setSession(sessionCookie.value);
    const account = new Account(client);
    await account.get(); // Validate the session
    return { account }; // Return valid account if session is valid
  } catch (error) {
    console.error('Session validation failed:', error);
    return null; // Return null if validation fails
  }
}

export async function createAdminClient() {
  try {
    // Validate required environment variables
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT;
    const key = process.env.NEXT_APPWRITE_KEY;

    if (!endpoint) {
      throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT environment variable');
    }
    if (!project) {
      throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT environment variable');
    }
    if (!key) {
      throw new Error('Missing NEXT_APPWRITE_KEY environment variable');
    }

    console.log('Creating Appwrite admin client with:', {
      endpoint,
      project,
      hasKey: !!key
    });

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(project)
      .setKey(key);

    return {
      get account() {
        return new Account(client);
      },
      get database() {
        return new Databases(client);
      },
      get user() {
        return new Users(client);
      },
    };
  } catch (error) {
    console.error('Failed to create Appwrite admin client:', error);
    throw error;
  }
}