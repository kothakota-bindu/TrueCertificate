# 📄 Certificate Verification DApp

A Blockchain-based Certificate Verification DApp deployed on the Ethereum Sepolia Testnet, enabling secure, tamper-proof issuance and verification of certificates using Smart Contracts, IPFS, and QR codes.

**✅ Key Features**

- Add certificates with:
    - 🎓 Student Name
    - 📚 Course Name
    - 📁 File upload (PDF / PNG / JPG stored on IPFS)
- Generates unique certId (bytes32) for each certificate
- Smart Contract stores certificate details immutably on-chain
- IPFS integration via Infura for decentralized file storage
- Copy certId to clipboard
- QR Code generation for easy sharing of certId or IPFS file
- Responsive React frontend with Tailwind CSS styling
- Ethers.js for Web3 blockchain interaction

 **Tech Stack Used:-**
 - Solidity Smart Contract (Sepolia Testnet)
 - React (Vite setup) for frontend development
 - ethers.js for blockchain connectivity
 - Tailwind CSS for responsive UI design
 - IPFS via Infura for file storage
 - QRCode.react for QR code generation

**📁 Project Structure**
```
src/
 ├── components/
 │    ├── AddCertificate.jsx      # Add Certificate UI & logic
 │    ├── CertificateList.jsx     # (Planned) List all certificates
 ├── abi/
 │    └── CertiProof.json         # Smart Contract ABI
 ├── config.js                    # Contract address, Sepolia network config
 ├── App.jsx                      # Main application entry
 ├── index.css                    # Tailwind CSS global styles
smart-contract/
 ├── CertiProof.sol               # Solidity Smart Contract
 ├── deploy.js                    # Deployment Script
package.json                       # Project dependencies
```
**Smart Contract Functionalities:**
- addCertificate(studentName, courseName, ipfsHash): Adds a new certificate on-chain
- Emits 'CertificateAdded(certId)' event after successful addition
- getCertificate(certId): Fetches certificate details (studentName, courseName, ipfsHash,   issuedAt)

 **Frontend Functionalities:**
 - Upload certificate file to IPFS.
 - Trigger Smart Contract to add certificate details.
 - Display Cert ID on successful addition.
 - Copy Cert ID to clipboard for easy sharing.
 - Show QR Code for Cert ID and IPFS link.
 - Planned: Certificate listing and verification logic.

 **Current Development Status:**
 - Smart Contract deployed successfully on Sepolia Testnet.
 - IPFS file upload integrated and functional.
 - Cert ID generation and QR code implemented.
 - Copy to clipboard functionality works.
 - Basic responsive frontend completed.

 **Planned Enhancements:**
 - List all certificates in frontend.
 - Add certificate verification by comparing certId and studentName.
 - Upgrade to ERC-721 NFT-based certificates for better authenticity.
 - Optionally make certificates Soulbound (non-transferable).
 - UI polish with QR code linking directly to certificate

**How to Run the Project:**

- Clone the repository
- Install dependencies:
     - npm install
- Start the development server:
     - npm run dev
- Connect your MetaMask wallet to the Sepolia Testnet
- Add certificates through the web interface
- Scan QR code or use certId for verification