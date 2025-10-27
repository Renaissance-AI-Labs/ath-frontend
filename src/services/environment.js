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

/**
 * Temporary stake limit configuration
 * Set to true to enable the 10 USDT per-user stake limit
 * Set to false to remove this limit (use only contract's maxStakeAmount)
 */
export const ENABLE_TEMPORARY_STAKE_LIMIT = false;

/**
 * The temporary maximum stake amount per user (in USDT)
 * Only applies when ENABLE_TEMPORARY_STAKE_LIMIT is true
 */
export const TEMPORARY_STAKE_LIMIT = 10;

/**
 * Enable single purchase limit configuration
 */
export const ENABLE_SINGLE_PURCHASE_LIMIT = true;

/**
 * Single purchase limit configuration
 * The maximum amount (in USDT) for a single stake transaction.
 */
export const SINGLE_PURCHASE_LIMIT = 200;

/**
 * Enable global staking limit based on USDT reserves in the pool.
 */
export const ENABLE_GLOBAL_STAKE_LIMIT = true;

/**
 * The maximum amount of USDT reserves in the pool.
 * If the current reserves exceed this value, staking will be disabled.
 */
export const GLOBAL_STAKE_LIMIT_USDT = 292600;


/**
 * Disable console logs in production
 * Set to true to disable console.log/debug/info in production environment
 */
export const DISABLE_CONSOLE_IN_PROD = true;
