import { ethers } from 'ethers';
import { bankerPoolContract, athContract, contractAddresses } from './contracts';
import { walletState } from './wallet';
import { showToast } from './notification';
import { t } from '../i18n';
import { APP_ENV } from './environment';

export const getBankerData = async () => {
    // Debug log
    console.log('[BankerData] getBankerData called. Contract:', !!bankerPoolContract, 'Address:', walletState.address);

    if (!bankerPoolContract || !walletState.address) {
        console.warn('[BankerData] Early return: Contract or Address missing');
        return null;
    }
    
    try {
        const address = walletState.address;
        
        // 1. userInvested (My Principal)
        const investedWei = await bankerPoolContract.userInvested(address);
        
        // 2. shares (Internal use for calculations)
        const sharesWei = await bankerPoolContract.shares(address);
        
        // 3. getSharePrice (Current Net Value)
        // 1 share = X.XX ATH. Both are 1e18 usually, but let's check decimals.
        // Assuming sharePrice is in 1e18 precision (e.g., 1.05 * 1e18)
        const sharePriceWei = await bankerPoolContract.getSharePrice();
        
        // 4. pendingReward (Pending Dividend)
        const pendingRewardWei = await bankerPoolContract.pendingReward(address);
        
        // 5. totalLiquidity (TVL)
        const totalLiquidityWei = await bankerPoolContract.totalLiquidity();

        // 6. lockPeriod info
        const lockPeriod = await bankerPoolContract.lockPeriod();
        const lastDepositTime = await bankerPoolContract.lastDepositTime(address);

        console.log(`[BankerData] lockPeriod: ${lockPeriod}, lastDepositTime: ${lastDepositTime}`);

        // --- Calculations ---
        const invested = parseFloat(ethers.formatUnits(investedWei, 18));
        const shares = parseFloat(ethers.formatUnits(sharesWei, 18));
        const sharePrice = parseFloat(ethers.formatUnits(sharePriceWei, 18));
        const pending = parseFloat(ethers.formatUnits(pendingRewardWei, 18));
        const tvl = parseFloat(ethers.formatUnits(totalLiquidityWei, 18));
        
        // Current Position Value = shares * SharePrice
        // shares is formatted (e.g. 100), sharePrice is formatted (e.g. 1.1) -> 110
        // Or if we use raw calculation: (sharesWei * sharePriceWei) / 1e18 / 1e18 -> formatted
        // Using float for display roughly is fine, but BigInt for precision if needed.
        // Formula: shares * SharePrice / 1e18 (from requirement)
        // sharesWei * sharePriceWei / 1e18 gives value in Wei.
        
        const valueInWei = (sharesWei * sharePriceWei) / 1000000000000000000n;
        const value = parseFloat(ethers.formatUnits(valueInWei, 18));
        
        // Liquidity PnL = Current Position Value - My Principal
        const pnl = value - invested;

        return {
            invested,
            shares,
            sharePrice,
            pending,
            tvl,
            value,
            pnl,
            lockPeriod: Number(lockPeriod),
            lastDepositTime: Number(lastDepositTime)
        };
        
    } catch (error) {
        console.error("Error fetching banker data:", error);
        return null;
    }
};

export const approveAthForBanker = async () => {
    if (!athContract) return false;
    const env = APP_ENV === 'PROD' ? 'production' : 'development';
    const bankerAddress = contractAddresses.bankerPool[env];
    
    try {
        const tx = await athContract.approve(bankerAddress, ethers.MaxUint256);
        await tx.wait();
        return true;
    } catch (error) {
        console.error("Approve failed:", error);
        return false;
    }
};

export const getAthAllowanceForBanker = async () => {
    if (!athContract || !walletState.address) return "0";
    const env = APP_ENV === 'PROD' ? 'production' : 'development';
    const bankerAddress = contractAddresses.bankerPool[env];
    
    try {
        const allowance = await athContract.allowance(walletState.address, bankerAddress);
        return ethers.formatUnits(allowance, 18);
    } catch (error) {
        console.error("Get allowance failed:", error);
        return "0";
    }
};

export const depositBanker = async (amount) => {
    if (!bankerPoolContract) return false;
    try {
        const amountWei = ethers.parseUnits(amount.toString(), 18);
        const tx = await bankerPoolContract.deposit(amountWei);
        await tx.wait();
        showToast(t('toast.txSuccess'));
        return true;
    } catch (error) {
        console.error("Deposit failed:", error);
        showToast(t('toast.txFailed'));
        return false;
    }
};

export const withdrawBanker = async (shareAmount) => {
    if (!bankerPoolContract) return false;
    try {
        const amountWei = ethers.parseUnits(shareAmount.toString(), 18);
        const tx = await bankerPoolContract.withdraw(amountWei);
        await tx.wait();
        showToast(t('toast.txSuccess'));
        return true;
    } catch (error) {
        console.error("Withdraw failed:", error);
        
        // Check for specific revert reason if possible, mainly lock period
        // But usually error.reason or error.message contains it
        if (error.message.includes("Lock period not over")) {
            showToast("Lock period not over");
        } else {
            showToast(t('toast.txFailed'));
        }
        return false;
    }
};

export const harvestBanker = async () => {
    if (!bankerPoolContract) return false;
    try {
        const tx = await bankerPoolContract.harvest();
        await tx.wait();
        showToast(t('toast.claimSuccess'));
        return true;
    } catch (error) {
        console.error("Harvest failed:", error);
        showToast(t('toast.claimFailed'));
        return false;
    }
};



