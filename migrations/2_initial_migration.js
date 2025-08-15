// eslint-disable-next-line no-undef
const JamToken = artifacts.require("JamToken");
// eslint-disable-next-line no-undef
const StellarToken = artifacts.require("StellartToken");
// eslint-disable-next-line no-undef
const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function (deployer, network, accounts) {
  //Deploy JamToken
  await deployer.deploy(JamToken);
  const jamToken = await JamToken.deployed();
  //Deploy StellarToken
  await deployer.deploy(StellarToken);
  const stellarToken = await StellarToken.deployed();
  //Deploy TokenFarm
  await deployer.deploy(TokenFarm, stellarToken.address, jamToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // Transfer tokens to the TokenFarm to manage defi
  await stellarToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // Transfer some tokens to an account for staking
  await jamToken.transfer(accounts[1], '1000000000000000000000000');
};
