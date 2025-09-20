# Sign-Up Troubleshooting Guide

## Overview
This guide helps diagnose and fix sign-up issues in the Ikigai Banking application deployed on Vercel.

## Quick Health Check
Visit `/api/health` on your deployed application to check if all environment variables are properly configured.

## Common Issues and Solutions

### 1. Environment Variables Missing
**Symptoms:** "Server configuration error. Please contact support."
**Solution:** 
- Check Vercel environment variables in your project settings
- Ensure all required variables are set (see Environment Variables section below)

### 2. Dwolla Configuration Issues
**Symptoms:** "Payment service configuration error. Please try again later."
**Solutions:**
- Verify `DWOLLA_ENV` is set to either "sandbox" or "production"
- Check `DWOLLA_KEY` and `DWOLLA_SECRET` are correct
- Ensure Dwolla account is properly configured

### 3. Appwrite Configuration Issues
**Symptoms:** "Database service error. Please try again later."
**Solutions:**
- Verify Appwrite endpoint URL is correct
- Check project ID matches your Appwrite project
- Ensure API key has proper permissions
- Verify database and collection IDs exist

### 4. Email Already Exists
**Symptoms:** "Email already exists. Please use a different email or sign in."
**Solution:** User should either use a different email or sign in with existing credentials

## Environment Variables Required

### Appwrite Configuration
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your-project-id
NEXT_APPWRITE_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_USER_COLLECTION_ID=your-user-collection-id
APPWRITE_BANK_COLLECTION_ID=your-bank-collection-id
```

### Dwolla Configuration
```
DWOLLA_ENV=sandbox
DWOLLA_KEY=your-dwolla-key
DWOLLA_SECRET=your-dwolla-secret
```

### Plaid Configuration
```
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
```

## Debugging Steps

### 1. Check Vercel Logs
1. Go to your Vercel dashboard
2. Navigate to your project
3. Click on "Functions" tab
4. Look for error logs during sign-up attempts

### 2. Test Health Endpoint
Visit `https://your-app.vercel.app/api/health` to verify all environment variables are set.

### 3. Check Service Status
- **Appwrite:** Verify your Appwrite project is active
- **Dwolla:** Check if your Dwolla account is in good standing
- **Plaid:** Ensure your Plaid account is properly configured

### 4. Verify Database Structure
Ensure your Appwrite database has the required collections:
- Users collection with proper attributes
- Banks collection for storing bank account data

## Error Messages and Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Missing required environment variables" | Environment variables not set in Vercel | Add missing variables in Vercel project settings |
| "Dwolla customer creation failed" | Dwolla API issues | Check Dwolla credentials and account status |
| "Failed to create user account in Appwrite" | Appwrite API issues | Verify Appwrite configuration and permissions |
| "Email already exists" | User trying to sign up with existing email | Use different email or sign in instead |

## Testing the Fix

1. **Deploy the updated code to Vercel**
2. **Test the health endpoint:** `GET /api/health`
3. **Try signing up with a new email**
4. **Check Vercel function logs for detailed error information**

## Monitoring

- Monitor Vercel function logs for detailed error information
- Use the health endpoint to verify configuration
- Check user feedback through the improved error messages in the UI

## Support

If issues persist after following this guide:
1. Check Vercel function logs for specific error details
2. Verify all environment variables are correctly set
3. Test each service (Appwrite, Dwolla, Plaid) individually
4. Contact support with specific error messages from the logs

