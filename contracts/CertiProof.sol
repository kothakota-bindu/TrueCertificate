// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertiProof {
    address public owner;

    struct Certificate {
        string studentName;
        string courseName;
        string ipfsHash;
        uint256 issuedAt;
    }

    mapping(bytes32 => Certificate) private certificates;
    mapping(address => bool) public isIssuer;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyIssuer() {
        require(isIssuer[msg.sender], "Not authorized issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        isIssuer[msg.sender] = true; // Contract deployer is an issuer by default
    }

    function addIssuer(address _issuer) external onlyOwner {
        isIssuer[_issuer] = true;
    }
    event CertificateAdded(bytes32 indexed certId);
    function addCertificate(string memory studentName, string memory courseName, string memory ipfsHash) external onlyIssuer {
        bytes32 certId = keccak256(abi.encodePacked(studentName, courseName, ipfsHash, block.timestamp));
        Certificate memory newCert = Certificate({
            studentName: studentName,
            courseName: courseName,
            ipfsHash: ipfsHash,
            issuedAt: block.timestamp
    });
        certificates[certId] = newCert;
        emit CertificateAdded(certId);
    }

    function getCertificate(bytes32 certId) external view returns (string memory, string memory, string memory, uint256) {
        Certificate memory cert = certificates[certId];
        require(bytes(cert.studentName).length > 0, "Certificate not found");
        return (cert.studentName, cert.courseName, cert.ipfsHash, cert.issuedAt);
    }
}
