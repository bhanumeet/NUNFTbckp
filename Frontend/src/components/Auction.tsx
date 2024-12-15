// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import NFTAuctionABI from "../abi/NFTAuction.abi.json";

// const NFTAuctionAddress = "0x84e4f0a87336478784b4b244a153025585979b85";

// interface Auction {
//   tokenId: string;
//   highestBid: string;
// }

// const Auction = () => {
//   const [auctionContract, setAuctionContract] = useState<ethers.Contract | null>(null);
//   const [nftContract, setNFTContract] = useState("");
//   const [tokenId, setTokenId] = useState("");
//   const [startingPrice, setStartingPrice] = useState("");
//   const [duration, setDuration] = useState("");
//   const [auctions, setAuctions] = useState<Auction[]>([]);

//   useEffect(() => {
//     const setupContract = async () => {
//       if (window.ethereum) {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();
//         const contract = new ethers.Contract(
//           NFTAuctionAddress,
//           NFTAuctionABI as ethers.InterfaceAbi,
//           signer
//         );
//         setAuctionContract(contract);
//       } else {
//         console.error("MetaMask not installed.");
//       }
//     };

//     setupContract();
//   }, []);

//   const createAuction = async () => {
//     if (!auctionContract || !nftContract || !tokenId || !startingPrice || !duration) {
//       alert("Please fill out all fields.");
//       return;
//     }
//     try {
//       const tx = await auctionContract.createAuction(
//         nftContract,
//         parseInt(tokenId),
//         ethers.parseEther(startingPrice),
//         parseInt(duration)
//       );
//       await tx.wait();
//       alert("Auction created successfully!");
//     } catch (err) {
//       console.error("Error creating auction:", err);
//     }
//   };

//   const fetchAuctions = async () => {
//     try {
//       const dummyAuctions = [
//         { tokenId: "1", highestBid: ethers.parseEther("0.1").toString() },
//         { tokenId: "2", highestBid: ethers.parseEther("0.2").toString() },
//       ];
//       setAuctions(dummyAuctions);
//     } catch (err) {
//       console.error("Error fetching auctions:", err);
//     }
//   };

//   useEffect(() => {
//     fetchAuctions();
//   }, []);

//   const placeBid = async (tokenId: string, bidAmount: string) => {
//     if (!auctionContract || !bidAmount) return;
//     try {
//       const tx = await auctionContract.placeBid(nftContract, parseInt(tokenId), {
//         value: ethers.parseEther(bidAmount),
//       });
//       await tx.wait();
//       alert("Bid placed successfully!");
//     } catch (err) {
//       console.error("Error placing bid:", err);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h1 style={styles.heading}>NFT Auction Platform</h1>
//       <div style={styles.form}>
//         <h2 style={styles.subheading}>Create Auction</h2>
//         <input
//           style={styles.input}
//           type="text"
//           placeholder="NFT Contract Address"
//           value={nftContract}
//           onChange={(e) => setNFTContract(e.target.value)}
//         />
//         <input
//           style={styles.input}
//           type="text"
//           placeholder="Token ID"
//           value={tokenId}
//           onChange={(e) => setTokenId(e.target.value)}
//         />
//         <input
//           style={styles.input}
//           type="text"
//           placeholder="Starting Price (ETH)"
//           value={startingPrice}
//           onChange={(e) => setStartingPrice(e.target.value)}
//         />
//         <input
//           style={styles.input}
//           type="text"
//           placeholder="Duration (seconds)"
//           value={duration}
//           onChange={(e) => setDuration(e.target.value)}
//         />
//         <button style={styles.button} onClick={createAuction}>
//           Create Auction
//         </button>
//       </div>
//       <div style={styles.auctions}>
//         <h2 style={styles.subheading}>Ongoing Auctions</h2>
//         {auctions.map((auction, idx) => (
//           <div style={styles.auctionCard} key={idx}>
//             <p style={styles.text}>
//               <strong>Token ID:</strong> {auction.tokenId}
//             </p>
//             <p style={styles.text}>
//               <strong>Highest Bid:</strong> {ethers.formatEther(auction.highestBid)} ETH
//             </p>
//             <button style={styles.button} onClick={() => placeBid(auction.tokenId, "1")}>
//               Bid 1 ETH
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     backgroundColor: "#121212",
//     color: "#e0e0e0",
//     fontFamily: "'Poppins', sans-serif",
//     minHeight: "100vh",
//     padding: "20px",
//     display: "flex",
//     flexDirection: "column" as const,
//     alignItems: "center",
//   },
//   heading: {
//     fontSize: "2.5rem",
//     fontWeight: "bold",
//     marginBottom: "20px",
//   },
//   subheading: {
//     fontSize: "1.5rem",
//     marginBottom: "10px",
//   },
//   form: {
//     width: "100%",
//     maxWidth: "400px",
//     backgroundColor: "#1e1e1e",
//     padding: "20px",
//     borderRadius: "8px",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
//     marginBottom: "30px",
//   },
//   input: {
//     width: "90%",
//     padding: "10px",
//     margin: "10px 0",
//     borderRadius: "4px",
//     border: "1px solid #444",
//     backgroundColor: "#2c2c2c",
//     color: "#e0e0e0",
//     fontSize: "1rem",
//   },
//   button: {
//     width: "100%",
//     padding: "10px",
//     backgroundColor: "#6200ea",
//     color: "#fff",
//     border: "none",
//     borderRadius: "4px",
//     fontSize: "1rem",
//     fontWeight: "bold",
//     cursor: "pointer",
//     marginTop: "10px",
//   },
//   auctions: {
//     width: "100%",
//     maxWidth: "800px",
//   },
//   auctionCard: {
//     backgroundColor: "#1e1e1e",
//     padding: "20px",
//     borderRadius: "8px",
//     marginBottom: "20px",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
//   },
//   text: {
//     marginBottom: "10px",
//   },
// };

// export default Auction;
