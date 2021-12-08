import { ethers } from 'hardhat'

const main = async () => {
  // This will actually compile our contract and generate the necessary files we need to work with our contract under the artifacts directory.
  const coffeeContractFactory = await ethers.getContractFactory('CoffeePortal')
  const coffeeContract = await coffeeContractFactory.deploy()

  await coffeeContract.deployed() // We'll wait until our contract is officially deployed to our local blockchain! Our constructor runs when we actually deploy.

  console.log('Coffee Contract deployed to:', coffeeContract.address)
}

const runMain = async () => {
  try {
    await main()
    process.exitCode = 0
  } catch (error) {
    console.log(error)
    process.exitCode = 1
  }
}

runMain()
