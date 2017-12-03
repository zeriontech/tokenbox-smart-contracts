let Token = artifacts.require("./TokenboxToken.sol");

module.exports = function(deployer, network, accounts) {
	const multisig = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
	const preIcoTokens = 6200000;
    deployer.deploy(Token, multisig, preIcoTokens,  { overwrite: true });
};
