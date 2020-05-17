const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
    // Deploy Token
    await deployer.deploy(Token);
    const token = await Token.deployed();

    // Deploy EthSwap
    await deployer.deploy(EthSwap, token.address);
    const ethSwap = await EthSwap.deployed();

    // Transfer all Tokens to EthSwap
    console.log("Transferring 1000000000000000000000000 WEI")
    console.log("        From Token Address:   "+token.address)
    console.log("          To EthSwap Address: "+ethSwap.address)
    await token.transfer(ethSwap.address, '1000000000000000000000000');
 };