// import { useState } from "react";

// import { IMetadata } from "../interfaces/IMetadata";

// const useFileSubmission = () => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [cid, setCid] = useState<string | null>(null);
//   const [metadataCid, setMetadataCid] = useState<string | null>(null);

//   const handleFileChange = (file: File) => {
//     setSelectedFile(file);
//   };

//   const handleSubmission = async () => {
//     if (!selectedFile) {
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append("file", selectedFile);

//       // Upload the image to IPFS
//       const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
//         },
//         body: formData,
//       });
//       const resData = await res.json();
//       const imageCid = resData.IpfsHash;
//       setCid(imageCid);

//       // Create metadata based on the image's IPFS hash
//       const metadata: IMetadata = {
//         name: "Image Name",
//         description: "Image Description",
//         image: `ipfs://${imageCid}`,
//         attributes: [],
//       };

//       // Upload the metadata JSON to IPFS
//       const metadataFormData = new FormData();
//       metadataFormData.append("file", new Blob([JSON.stringify(metadata)], { type: "application/json" }));

//       const metadataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
//         },
//         body: metadataFormData,
//       });
//       const metadataResData = await metadataRes.json();
//       const metadataCid = metadataResData.IpfsHash;
//       setMetadataCid(metadataCid);

//       console.log("File uploaded successfully:", imageCid);
//       console.log("Metadata uploaded successfully:", metadataCid);
//     } catch (error) {
//       console.error("Error uploading file or metadata:", error);
//     }
//   };

//   return { handleFileChange, handleSubmission, cid, metadataCid };
// };

// export default useFileSubmission;
