import Container from "@mui/material/Container";
import NFTGallery from "./components/NFTGallery";
import { WagmiWrapper } from "./components/WagmiWrapper";
import { MintNFT } from "./components/MintNFT";
import OwnedNFTs from "./components/OwnedNFTs";
//import Auction from "./components/Auction";

const App: React.FC = () => {
  return (
    <div style={{ backgroundColor: "#121212", color: "#ffffff", minHeight: "100vh" }}>
      <Container>
        <WagmiWrapper>
          <MintNFT />
          <OwnedNFTs />
          <NFTGallery />
          {/* <Auction /> */}
        </WagmiWrapper>
      </Container>
    </div>
  );
};

export default App;

