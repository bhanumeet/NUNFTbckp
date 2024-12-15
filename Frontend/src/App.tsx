import Container from "@mui/material/Container";
import NFTGallery from "./components/NFTGallery";
import { WagmiWrapper } from "./components/WagmiWrapper";
import { MintNFT } from "./components/MintNFT";
import OwnedNFTs from "./components/OwnedNFTs";
import AuctionPage from "./components/AuctionPage";
//import Converter from "./components/Converter";

const App: React.FC = () => {
  return (
    <div style={{ backgroundColor: "#121212", color: "#ffffff", minHeight: "100vh" }}>
      <Container>
        <WagmiWrapper>
          <MintNFT />
          <OwnedNFTs />
          <NFTGallery />
          {/* <Converter /> */}
          <AuctionPage />
        </WagmiWrapper>
      </Container>
    </div>
  );
};

export default App;

