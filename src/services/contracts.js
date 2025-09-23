import { ethers } from 'ethers';
import { walletState } from './wallet';

// --- Import ABIs ---
import referralAbi from '../abis/referral.json';
import stakingAbi from '../abis/staking.json';
import athAbi from '../abis/ath.json';

// --- Contract Addresses ---
const contractAddresses = {
  referral: {
    production: '', // To be deployed
    development: '0x20B0850f3B888B4C2494E7C7fbcF9808C6e82F77',
  },
  staking: {
    production: '', // To be deployed
    development: '0xE8bF70FCcdA199A1CC2F90412e6Ab13779F95B3F',
  },
  ath: {
    production: '', // To be deployed
    development: '0x705c99F6C25056cC73B299dFe209d80455FA7D63',
  },
};

// --- Contract Instances ---
let referralContract;
let stakingContract;
let athContract;

/**
 * Initializes all contract instances with the current signer from walletState.
 * This should be called after a successful wallet connection.
 */
export const initializeContracts = () => {
  if (!walletState.signer) {
    console.warn("Cannot initialize contracts without a signer.");
    return;
  }

  const isProduction = import.meta.env.PROD;
  const env = isProduction ? 'production' : 'development';

  console.log(`Initializing contracts for ${env} environment.`);

  // Get addresses for the current environment
  const referralAddress = contractAddresses.referral[env];
  const stakingAddress = contractAddresses.staking[env];
  const athAddress = contractAddresses.ath[env];

  // Create new contract instances
  referralContract = new ethers.Contract(referralAddress, referralAbi, walletState.signer);
  stakingContract = new ethers.Contract(stakingAddress, stakingAbi, walletState.signer);
  athContract = new ethers.Contract(athAddress, athAbi, walletState.signer);

  console.log("Contracts initialized:", {
    referral: referralContract.address,
    staking: stakingContract.address,
    ath: athContract.address,
  });
};

/**
 * Resets all contract instances.
 * This should be called on wallet disconnection or account change.
 */
export const resetContracts = () => {
  referralContract = null;
  stakingContract = null;
  athContract = null;
  console.log("Contract instances have been reset.");
};

// --- Exported Functions to get contract instances (optional, but good practice) ---
// This allows other parts of the app to get a read-only instance if needed,
// but for now, we will keep them internal and expose specific function calls later.

// Example of how we will export specific functions later:
/*
export const getUserBalance = async () => {
  if (!athContract) throw new Error("ATH contract not initialized.");
  return await athContract.balanceOf(walletState.address);
};
*/
