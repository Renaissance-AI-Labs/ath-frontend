import { ethers } from 'ethers';
import { walletState } from './wallet';
import usdtJuAbi from '../abis/ath.json';
import xbrokersAbi from '../abis/xbrokers.json';

const USDT_JU_ADDRESS = '0xc8e19C19479a866142B42fB390F2ea1Ff082E0D2';
const XBROKERS_ADDRESS = '0xd4cee460Ceb47D1A30E1672EE2a13ecdf362Cf5a';

let usdtJuContract;
let xbrokersContract;

export const initializeJuChainContracts = () => {
  if (walletState.signer && walletState.chainId === 210000) {
    usdtJuContract = new ethers.Contract(USDT_JU_ADDRESS, usdtJuAbi, walletState.signer);
    xbrokersContract = new ethers.Contract(XBROKERS_ADDRESS, xbrokersAbi, walletState.signer);
    console.log("JuChain contracts initialized.");
    return true;
  }
  return false;
};

export const getBoundUid = async () => {
  if (!xbrokersContract) {
    if (!initializeJuChainContracts()) {
      throw new Error("Cannot initialize JuChain contracts.");
    }
  }
  try {
    const uid = await xbrokersContract.uidOf(walletState.address);
    return uid.toString();
  } catch (error) {
    console.error("Error fetching bound UID:", error);
    return "0";
  }
};

export const bindUid = async (uid) => {
  if (!xbrokersContract) {
    if (!initializeJuChainContracts()) {
      throw new Error("Cannot initialize JuChain contracts.");
    }
  }
  try {
    const tx = await xbrokersContract.bindUid(uid);
    return tx;
  } catch (error) {
    console.error("Error binding UID:", error);
    throw error;
  }
};

export const getUsdtJuAllowance = async () => {
  if (!usdtJuContract) {
    if (!initializeJuChainContracts()) {
      throw new Error("Cannot initialize JuChain contracts.");
    }
  }
  try {
    const allowance = await usdtJuContract.allowance(walletState.address, XBROKERS_ADDRESS);
    return ethers.formatUnits(allowance, 18);
  } catch (error) {
    console.error("Error fetching USDT-JU allowance:", error);
    return "0";
  }
};

export const approveUsdtJu = async () => {
  if (!usdtJuContract) {
    if (!initializeJuChainContracts()) {
      throw new Error("Cannot initialize JuChain contracts.");
    }
  }
  try {
    // Approve the maximum possible amount
    const tx = await usdtJuContract.approve(XBROKERS_ADDRESS, ethers.MaxUint256);
    return tx;
  } catch (error) {
    console.error("Error approving USDT-JU:", error);
    throw error;
  }
};

export const deposit = async (amount) => {
  if (!xbrokersContract) {
    if (!initializeJuChainContracts()) {
      throw new Error("Cannot initialize JuChain contracts.");
    }
  }
  try {
    const amountInWei = ethers.parseUnits(amount.toString(), 18);
    const projectCode = "xnodeydn";
    // Deposit is for the connected user's address.
    const depositFor = walletState.address;
    
    // Call the contract with all three required arguments.
    const tx = await xbrokersContract.deposit(projectCode, depositFor, amountInWei, {
      // No `value` needed for token transfers, only for native currency (main coin)
    });
    return tx;
  } catch (error) {
    console.error("Error depositing:", error);
    throw error;
  }
};

export const getUsdtJuBalance = async () => {
  if (!usdtJuContract) {
    console.log("JuChain contract not initialized.");
    if (!initializeJuChainContracts()) {
      return '0';
    }
  }

  try {
    const balance = await usdtJuContract.balanceOf(walletState.address);
    // Assuming USDT-JU also has 18 decimals like standard USDT
    return ethers.formatUnits(balance, 18); 
  } catch (error) {
    console.error("Error fetching USDT-JU balance:", error);
    return '0';
  }
};
