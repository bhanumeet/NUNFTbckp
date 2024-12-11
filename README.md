# Decentralized NFT Marketplace 🌐🔖

Welcome to the **Decentralized NFT Marketplace**! This project offers a platform where creators can mint their unique digital assets as NFTs, list them for sale, and transfer ownership seamlessly. Built on blockchain technology, this marketplace ensures transparency, security, and decentralization.

## Key Features 🔹🔐
- **Decentralized Storage**: NFT images and metadata are stored on IPFS (InterPlanetary File System) for enhanced accessibility and resilience.
- **Mint and List NFTs**: Creators can mint NFTs and transfer their ownership to the marketplace admin for listing.
- **Buy and Resell**: Users can buy NFTs, connect their wallets, and even relist purchased assets for resale.
- **Decentralized UI**: The marketplace interface is hosted on IPFS, ensuring global accessibility without reliance on centralized servers.

---

## Installation ⚙️

Get started by following these steps:

### 1. Clone the Repository 📎
```bash
git clone https://github.com/bhanumeet/NUNFTmarketplace.git
```

### 2. Install Frontend Dependencies 🛠️
Navigate to the `frontend` directory and install the required packages:
```bash
cd decentralized-nft-marketplace/frontend
npm install
```

### 3. Configure Pinata for IPFS Deployment 🌎
Generate your API key and JWT (JSON Web Token) from [Pinata](https://pinata.cloud). These credentials will be required to deploy NFT images and metadata to IPFS.

### 4. Install Foundry and ERC721 Libraries ⚖️
Ensure you have the required libraries for contract deployment:
```bash
forge install @openzeppelin/foundry --no-commit
forge install @openzeppelin/contracts --no-commit
```

### 5. Set Up Environment Variables 🔧
Create a `.env` file in the root directory and add the following variables:
```plaintext
PRIVATE_KEY=your_wallet_private_key
RPC_URL=rpc_url_for_your_chosen_network
```
Replace `your_wallet_private_key` with your Ethereum wallet’s private key and `rpc_url_for_your_chosen_network` with the RPC URL of your preferred network.

### 6. Deploy Contracts to Chosen Network 🚀
Deploy contracts using the `make` command. For example, to deploy on the Holskey network:
```bash
make deploy holskey
```
Replace `holskey` with your target network configuration.

---

## Usage Guide 🌐

### For Creators 🎨

#### 1. Mint and List Your NFT
1. **Connect Wallet**: Link your Ethereum wallet to the platform.
2. **Upload Image**: Add an image and metadata (name and description) for your NFT.
3. **Mint NFT**: Use the `Token.sol` contract to mint your NFT with the IPFS URL.
4. **List NFT for Sale**: Set a price and transfer ownership to the marketplace admin for listing.

---

### For Buyers 🚀

#### 1. Connect Your Wallet
- Use the platform’s wallet connect feature to link your Ethereum wallet.

#### 2. Browse & Purchase NFTs
- Explore the listed NFTs on the marketplace.
- Buy your favorite NFT by confirming the transaction in your wallet. Ownership will be transferred instantly.

#### 3. Relist NFTs for Sale
- Resell NFTs by setting a new price and updating metadata, if required.

---

## Highlights 🏆
- **Secure Transactions**: Payments are directly processed between buyers and sellers.
- **Seamless Relisting**: NFT owners can easily adjust pricing and relist items for sale.
- **User-Centric Design**: Intuitive and decentralized UI hosted on IPFS.

---

## Tech Stack 🛠️
- **Frontend**: React.js, Node.js
- **Blockchain**: Solidity, OpenZeppelin Libraries
- **Storage**: IPFS via Pinata
- **Smart Contracts**: ERC721 standards

---

Ready to experience the decentralized revolution? Join us and unleash the power of NFTs! 🌟

