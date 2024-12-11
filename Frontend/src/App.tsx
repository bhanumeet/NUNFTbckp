import Container from "@mui/material/Container";
import NFTGallery from "./components/NFTGallery";

import { WagmiWrapper } from "./components/WagmiWrapper";
import { MintNFT } from "./components/MintNFT";
import OwnedNFTs from "./components/OwnedNFTs";

const App: React.FC = () => {
  return (
    <div>
      <Container>
        <WagmiWrapper>
          <MintNFT />
          <OwnedNFTs />
          <NFTGallery />
        </WagmiWrapper>
      </Container>
    </div>
  );
};

export default App;
