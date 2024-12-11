// // src/hooks/useMetadataProcessing.ts
// import { useState } from "react";
// import { IMetadata } from "../interfaces/IMetadata";

// const useMetadataProcessing = () => {
//   const [metadata, setMetadata] = useState<IMetadata | null>(null);

//   const handleProcess = async (cid: string | null) => {
//     if (cid) {
//       const metadataJson: IMetadata = {
//         description: "An amazing NFT!",
//         image: `https://ipfs.io/ipfs/${cid}`,
//         name: "My NFT",
//         attributes: [],
//       };
//       setMetadata(metadataJson);
//     }
//   };

//   return { handleProcess, metadata };
// };

// export default useMetadataProcessing;
