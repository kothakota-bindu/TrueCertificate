const hre = require("hardhat");

async function main() {
  const CertiProof = await hre.ethers.getContractFactory("CertiProof");
  const contract = await CertiProof.deploy();

  await contract.waitForDeployment();

  console.log("✅ CertiProof contract deployed at:", await contract.getAddress());

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
