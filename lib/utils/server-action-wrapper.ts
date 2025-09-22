import { NextRequest } from 'next/server';

export async function withErrorHandling<T>(
  action: () => Promise<T>,
  context: string = 'Server Action'
): Promise<T> {
  try {
    console.log(`${context} started`);
    const result = await action();
    console.log(`${context} completed successfully`);
    return result;
  } catch (error) {
    console.error(`${context} failed:`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      context
    });

    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`${context} failed: ${error.message}`);
    }
    throw new Error(`${context} failed with unknown error`);
  }
}

export function createServerAction<T extends any[], R>(
  action: (...args: T) => Promise<R>,
  context: string = 'Server Action'
) {
  return async (...args: T): Promise<R> => {
    return withErrorHandling(() => action(...args), context);
  };
}
