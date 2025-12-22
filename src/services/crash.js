import { ethers } from 'ethers';
import { crashContract, athContract, contractAddresses } from './contracts';
import { walletState } from './wallet';
import { APP_ENV } from './environment';
import { showToast } from './notification';
import { t } from '../i18n';

// Constants
export const BLOCK_LIMIT = 255;

/**
 * Gets the current ATH balance for the user.
 */
export const getAthBalance = async () => {
  if (!athContract || !walletState.address) return "0";
  try {
    const balance = await athContract.balanceOf(walletState.address);
    return ethers.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error fetching ATH balance:", error);
    return "0";
  }
};

/**
 * Gets the current ATH allowance for the crash contract.
 */
export const getAthAllowance = async () => {
  const env = APP_ENV === 'PROD' ? 'production' : 'development';
  const crashAddress = contractAddresses.crash[env];
  
  if (!athContract || !walletState.address || !crashAddress) return "0";
  
  try {
    const allowance = await athContract.allowance(walletState.address, crashAddress);
    return ethers.formatUnits(allowance, 18);
  } catch (error) {
    console.error("Error fetching ATH allowance:", error);
    return "0";
  }
};

/**
 * Approves the crash contract to spend ATH.
 */
export const approveAth = async () => {
  const env = APP_ENV === 'PROD' ? 'production' : 'development';
  const crashAddress = contractAddresses.crash[env];
  
  if (!athContract || !crashAddress) return false;
  
  try {
    const tx = await athContract.approve(crashAddress, ethers.MaxUint256);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error approving ATH:", error);
    return false;
  }
};

/**
 * Places a bet.
 * @param {string} amount - Amount in USDT
 * @param {number} prediction - Prediction multiplier (e.g., 2.00)
 */
export const placeBet = async (amount, prediction) => {
  if (!crashContract) return false;
  
  try {
    const amountWei = ethers.parseUnits(amount.toString(), 18);
    const predictionScaled = Math.round(prediction * 100);
    
    console.log("Placing bet params:", { amount: amountWei.toString(), prediction: predictionScaled, originalPrediction: prediction });

    // Try static call to see revert reason more clearly
    try {
        await crashContract.bet.staticCall(amountWei, predictionScaled);
        console.log("Static call passed");
    } catch (e) {
        console.error("Static call simulation failed:", e);
        // Throwing here will be caught by the outer catch block
        throw e;
    }

    const tx = await crashContract.bet(amountWei, predictionScaled);
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error placing bet:", error);
    if (error.code !== 'ACTION_REJECTED') {
      showToast(t('toast.txFailed', { reason: error.reason || error.message }));
    }
    return false;
  }
};

/**
 * Settles the current bet.
 * @returns {Promise<Object|null>} Result object { crashPoint, won, payout } or null
 */
export const settleBet = async () => {
  if (!crashContract) return null;
  
  try {
    const tx = await crashContract.settle();
    const receipt = await tx.wait();
    
    // Parse logs to find BetResolved
    const event = receipt.logs
      .map(log => {
        try {
          return crashContract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find(parsed => parsed && parsed.name === 'BetResolved');

    if (event) {
      return {
        crashPoint: Number(event.args.crashPoint) / 100,
        won: event.args.won,
        payout: ethers.formatUnits(event.args.payout, 18)
      };
    }
    
    // Check for BetVoided
    const voidEvent = receipt.logs
      .map(log => {
        try {
          return crashContract.interface.parseLog(log);
        } catch (e) {
            return null;
        }
      })
      .find(parsed => parsed && parsed.name === 'BetVoided');
      
    if (voidEvent) {
        return {
            crashPoint: 0,
            won: false,
            payout: "0",
            voided: true
        };
    }

    return null;
  } catch (error) {
    console.error("Error settling bet:", error);
    if (error.code !== 'ACTION_REJECTED') {
       showToast(t('toast.txFailed', { reason: error.reason || error.message }));
    }
    return null;
  }
};

/**
 * Gets the active bet for the current user.
 */
export const getActiveBet = async () => {
  if (!crashContract || !walletState.address) return null;
  
  try {
    const bet = await crashContract.activeBets(walletState.address);
    if (bet.amount === 0n) return null;
    
    return {
      amount: ethers.formatUnits(bet.amount, 18),
      prediction: Number(bet.prediction) / 100,
      betBlock: Number(bet.betBlock),
      betTime: Number(bet.betTime)
    };
  } catch (error) {
    console.error("Error fetching active bet:", error);
    return null;
  }
};

/**
 * Fetches global history.
 */
export const getGlobalHistory = async (cursor = 0, size = 10) => {
  if (!crashContract) return [];
  
  try {
    const result = await crashContract.getGlobalHistory(cursor, size);
    const records = result[0]; // First return value is the array
    
    // Handle reverse order manually since contract returns from cursor
    // But typically we want latest. The contract `getGlobalHistory` logic:
    // "values[i] = globalHistory[cursor + i];"
    // So to get latest, we need to know the length first.
    
    return records.map(r => ({
      player: r.player,
      amount: ethers.formatUnits(r.amount, 18),
      prediction: Number(r.prediction) / 100,
      crashPoint: Number(r.crashPoint) / 100,
      won: r.won,
      payout: ethers.formatUnits(r.payout, 18),
      betBlock: Number(r.betBlock),
      timestamp: Number(r.timestamp)
    }));
  } catch (error) {
    console.error("Error fetching global history:", error);
    return [];
  }
};

export const getGlobalHistoryLength = async () => {
    if (!crashContract) return 0;
    try {
        return Number(await crashContract.getGlobalHistoryLength());
    } catch (e) {
        return 0;
    }
}

/**
 * Fetches user history.
 */
export const getUserHistory = async (cursor = 0, size = 10) => {
  if (!crashContract || !walletState.address) return [];
  
  try {
    const result = await crashContract.getUserHistory(walletState.address, cursor, size);
    const records = result[0];
    
    return records.map(r => ({
      amount: ethers.formatUnits(r.amount, 18),
      prediction: Number(r.prediction) / 100,
      crashPoint: Number(r.crashPoint) / 100,
      won: r.won,
      payout: ethers.formatUnits(r.payout, 18),
      betBlock: Number(r.betBlock),
      timestamp: Number(r.timestamp)
    }));
  } catch (error) {
    console.error("Error fetching user history:", error);
    return [];
  }
};

export const getUserHistoryLength = async () => {
    if (!crashContract || !walletState.address) return 0;
    try {
        return Number(await crashContract.getUserHistoryLength(walletState.address));
    } catch (e) {
        return 0;
    }
}

export const getGameConfig = async () => {
    console.log("getGameConfig called. crashContract exists:", !!crashContract);
    if (!crashContract) return null;
    try {
        console.log("Calling contract.getGameConfig()...");
        const config = await crashContract.getGameConfig();
        console.log("Contract config received:", config);

        // Check configured Token address for debugging
        try {
            const tokenAddr = await crashContract.athToken(); // Keep reading athToken() from contract as that's the var name
            console.log("Crash Contract configured Payment token:", tokenAddr);
        } catch (e) {
            console.warn("Could not fetch token address from contract:", e);
        }

        return {
            houseEdge: Number(config._houseEdge),
            minBet: ethers.formatUnits(config._minBet, 18),
            maxBet: ethers.formatUnits(config._maxBet, 18),
            minPrediction: Number(config._minPrediction) / 100,
            maxPrediction: Number(config._maxPrediction) / 100,
            blockLimit: Number(config._blockLimit)
        };
    } catch (e) {
        console.error("Error getting game config:", e);
        return null;
    }
}

