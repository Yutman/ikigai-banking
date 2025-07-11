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
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

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
}