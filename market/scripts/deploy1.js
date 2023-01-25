const hre = require("hardhat");

const fs = require('fs');

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  // const nftMarketplace = await NFTMarketplace.deploy("0x2F984E550b1880bBD1ea0802f2446a77D1dD8009");
  const nftMarketplace = await NFTMarketplace.deploy("0xB4cf154075A8a7e26753571b90D886496D79224e");
  await nftMarketplace.deployed();

  console.log("nftMarketplace deployed to:", nftMarketplace.address);
 
  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
