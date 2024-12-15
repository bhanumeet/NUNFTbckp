import { useEffect, useState } from "react";
import { parseEther } from "ethers";
import { Contract, BrowserProvider } from "ethers";
import AuctionABI from "../abi/Auction.abi.json";

const AuctionContractAddress = "0x0d640035017c6f59B4ddF8f30e04A24CF0Ca8527";

const AuctionPage = () => {
  const [auctionContract, setAuctionContract] = useState<Contract | null>(null);
  const [tokenId, setTokenId] = useState<string>("");
  const [startingPrice, setStartingPrice] = useState<string>("");
  const [auctionDuration, setAuctionDuration] = useState<string>("");
  const [auctionId, setAuctionId] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<string>("");
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(AuctionContractAddress, AuctionABI, signer);
        setAuctionContract(contract);
      } else {
        console.error("MetaMask not installed; using read-only defaults");
      }
    };

    initializeContract();
  }, []);

  const fetchAuctions = async () => {
    if (!auctionContract) return;

    try {
      const auctionCount = await auctionContract.auctionCount();
      const auctionList = [];
      for (let i = 0; i < auctionCount; i++) {
        const auction = await auctionContract.getAuction(i);
        auctionList.push({
          auctionId: i,
          nftCollection: auction.nftCollection,
          tokenId: auction.tokenId.toString(),
          startingPrice: Number(auction.startingPrice) / 1e18,
          highestBid: Number(auction.highestBid) / 1e18,
          highestBidder: auction.highestBidder,
          endTime: new Date(Number(auction.endTime) * 1000).toLocaleString(),
          ended: auction.ended,
        });
      }
      setAuctions(auctionList);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  useEffect(() => {
    if (auctionContract) fetchAuctions();
  }, [auctionContract]);

  const createAuction = async () => {
    if (!auctionContract || !tokenId || !startingPrice || !auctionDuration) {
      alert("Please fill all fields to create an auction.");
      return;
    }

    try {
      const tx = await auctionContract.createAuction(
        "0x53a70FFd8A76Bb50Dc018AdF84a6A96D3Da54Cb2",
        BigInt(tokenId),
        parseEther(startingPrice),
        BigInt(auctionDuration)
      );
      await tx.wait();
      alert("Auction created successfully!");
      fetchAuctions();
    } catch (error) {
      console.error(error);
      alert("Failed to create auction.");
    }
  };

  const placeBid = async () => {
    if (!auctionContract || !auctionId || !bidAmount) {
      alert("Please provide auction ID and bid amount.");
      return;
    }

    try {
      const tx = await auctionContract.placeBid(BigInt(auctionId), {
        value: parseEther(bidAmount),
      });
      await tx.wait();
      alert("Bid placed successfully!");
      fetchAuctions();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Failed to place bid.");
    }
  };

  const endAuction = async () => {
    if (!auctionContract || !auctionId) {
      alert("Please provide an auction ID.");
      return;
    }

    try {
      const tx = await auctionContract.endAuction(BigInt(auctionId));
      await tx.wait();
      alert("Auction ended successfully!");
      fetchAuctions();
    } catch (error) {
      console.error(error);
      alert("Failed to end auction.");
    }
  };

  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#fff",
      backgroundColor: "#0b0b0b",
      minHeight: "100vh",
    },
    section: {
      backgroundColor: "#1a1a1a",
      padding: "20px",
      borderRadius: "10px",
      marginBottom: "20px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    },
    input: {
      display: "block",
      marginBottom: "15px",
      padding: "12px",
      width: "100%",
      backgroundColor: "#262626",
      color: "#fff",
      border: "1px solid #444",
      borderRadius: "8px",
      boxSizing: "border-box" as const,
    },
    button: {
      background: "linear-gradient(90deg,rgb(155, 48, 255),rgb(42, 27, 252))",
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      fontSize: "1rem",
      transition: "background 0.3s",
    },
    buttonHover: {
      background: "linear-gradient(90deg,rgb(187, 69, 255),rgb(65, 40, 255))",
    },
    auctionItem: {
      border: "1px solid #333",
      padding: "15px",
      borderRadius: "10px",
      marginBottom: "15px",
      backgroundColor: "#121212",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#a29bfe" }}>
        🚀 NFT Auction Platform
      </h1>

      <div style={styles.section}>
        <h2>Create Auction</h2>
        <input
          type="text"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Starting Price (ETH)"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Auction Duration (seconds)"
          value={auctionDuration}
          onChange={(e) => setAuctionDuration(e.target.value)}
          style={styles.input}
        />
        <button onClick={createAuction} style={styles.button}>
          Create Auction
        </button>
      </div>

      <div style={styles.section}>
        <h2>Place Bid</h2>
        <input
          type="text"
          placeholder="Auction ID"
          value={auctionId}
          onChange={(e) => setAuctionId(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Bid Amount (ETH)"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          style={styles.input}
        />
        <button onClick={placeBid} style={styles.button}>
          Place Bid
        </button>
      </div>

      <div style={styles.section}>
        <h2>End Auction</h2>
        <input
          type="text"
          placeholder="Auction ID"
          value={auctionId}
          onChange={(e) => setAuctionId(e.target.value)}
          style={styles.input}
        />
        <button onClick={endAuction} style={styles.button}>
          End Auction
        </button>
      </div>

      <div style={styles.section}>
        <h2>Ongoing Auctions</h2>
        {auctions.map((auction) => (
          <div key={auction.auctionId} style={styles.auctionItem}>
            <p>Auction ID: {auction.auctionId}</p>
            <p>Token ID: {auction.tokenId}</p>
            <p>Starting Price: {auction.startingPrice} ETH</p>
            <p>Highest Bid: {auction.highestBid} ETH</p>
            <p>End Time: {auction.endTime}</p>
            <p>Status: {auction.ended ? "Ended" : "Active"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionPage;
