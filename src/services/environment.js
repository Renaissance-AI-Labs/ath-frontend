// src/services/environment.js

/**
 * Determines the application's current running environment.
 * It checks Vercel's system environment variable to distinguish between
 * production, preview, and local development environments.
 *
 * @returns {'PROD' | 'test' | 'dev'} The environment identifier.
 *    - 'PROD': For Vercel production deployments.
 *    - 'test': For Vercel preview deployments.
 *    - 'dev':  For local development (e.g., via `npm run dev`).
 */
const getAppEnv = () => {
  const vercelEnv = import.meta.env.VITE_VERCEL_ENV;
  if (vercelEnv === 'production') {
    return 'PROD'; // Vercel Production
  }
  if (vercelEnv === 'preview') {
    return 'test'; // Vercel Preview
  }
  return 'dev'; // Local development
};

/**
 * A constant representing the current application environment.
 * Import this constant across the application to ensure consistent
 * environment-specific logic.
 */
export const APP_ENV = getAppEnv();
