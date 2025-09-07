import { reactive } from 'vue';
import { ethers } from 'ethers';

// Reactive state for wallet information
export const walletState = reactive({
  isConnected: false,
  address: null,
  network: null, // To store the network name
});

// Utility function to format wallet address
export const formatAddress = (address) => {
  if (!address || address.length < 11) {
    return 'Invalid Address';
  }
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Main function to connect to a wallet
export const connectWallet = async (walletType) => {
  let provider;
  
  if (typeof window.ethereum === 'undefined') {
    alert('Please install a wallet extension like MetaMask!');
    return false;
  }

  // Detect the provider based on wallet type
  // For many modern wallets (like OKX, TokenPocket), they inject themselves
  // in a way that is compatible with the standard window.ethereum provider object.
  // We can add specific detection logic if needed, but this is a robust starting point.
  provider = new ethers.BrowserProvider(window.ethereum);

  try {
    // 1. Request account access
    const accounts = await provider.send('eth_requestAccounts', []);
    const address = accounts[0];
    
    // 2. Get the signer
    const signer = await provider.getSigner();

    // 3. Get Network Info
    const network = await provider.getNetwork();

    // 4. Request a signature
    const message = "Welcome to the ATH platform. Please sign this message to verify your wallet.";
    await signer.signMessage(message);

    // 5. Update the global state
    walletState.isConnected = true;
    walletState.address = address;
    walletState.network = network.name; // Store network name (e.g., 'sepolia', 'mainnet')

    console.log(`Wallet connected: ${address} on network ${network.name}`);
    return true;

  } catch (error) {
    // Check for user rejection (Ethers v6 uses 'ACTION_REJECTED')
    if (error.code === 'ACTION_REJECTED') {
      console.log('User rejected the connection/signature request.');
    } else {
      console.error('Failed to connect wallet:', error);
      alert(`Connection failed: ${error.message || 'An unexpected error occurred.'}`);
    }
    return false;
  }
};

// Function to disconnect the wallet
export const disconnectWallet = () => {
  walletState.isConnected = false;
  walletState.address = null;
  walletState.network = null;
  console.log('Wallet disconnected.');
};
