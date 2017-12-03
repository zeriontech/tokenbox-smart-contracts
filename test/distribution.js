let Token = artifacts.require('./TokenboxToken.sol');
let constants = require('./constants.js');


contract('TokenboxToken.', function(accounts) {

	let ethInvestor = '0x0123456789012345678901234567890123456789';
	let btcInvestor = '0x0987654321098765432109876543210987654321';
	let wireInvestor = '0x0123459876012345987601234598760123459876';
	let preICOInvestor = '0x9876501234987650123498765012349876501234';

	let ethToUsd = 500;
	let btcToUsd = 10000;

	let ethInvestment = 100;
	let btcInvestment = 10;
	let wireInvestment = 10000;


	it('Fix 100 ETH investment', function(done) {
        var contract;

        let investment = ethInvestment;

        let tokenPriceInPicoUsd = Math.pow(10, 12);
        let ethToWei = Math.pow(10, 18);

	    let tokensNumber = investment * ethToUsd; // 1 TBX = 1 USD


        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.ethInvestment(ethInvestor, tokenPriceInPicoUsd, investment * ethToWei,
            							  0x12345, ethToWei / ethToUsd, { from: constants.owner });
        }).then(function(tx) {
            return contract.balanceOf.call(ethInvestor);
        }).then(function(balance) {
        	assert.equal(balance.toNumber(), tokensNumber * Math.pow(10, 18), 'ETH investment wasn\' fixed');
        }).then(done);
    });

    it('Fix 10 BTC investment', function(done) {
        var contract;

        let investment = btcInvestment;

        let tokenPriceInPicoUsd = Math.pow(10, 12);
        let btcToSatoshi = Math.pow(10, 12);

	    let tokensNumber = investment * btcToUsd; // 1 TBX = 1 USD


        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.btcInvestment(btcInvestor, tokenPriceInPicoUsd, investment * btcToSatoshi, 'BTC_ADDRESS',
            							  btcToSatoshi / btcToUsd, { from: constants.owner });
        }).then(function(tx) {
            return contract.balanceOf.call(btcInvestor);
        }).then(function(balance) {
        	assert.equal(balance.toNumber(), tokensNumber * Math.pow(10, 18), 'BTC investment wasn\' fixed');
        }).then(done);
    });

    it('Fix 10,000 USD wire investment', function(done) {
        var contract;

        let investment = wireInvestment;

        let tokenPriceInUsdCents = 100;
	    let tokensNumber = investment; // 1 TBX = 1 USD


        Token.deployed().then(function(instance) {
            contract = instance;
            contract.wireInvestment(wireInvestor, tokenPriceInUsdCents, investment * 100, { from: constants.owner });
        }).then(function(tx) {
            return contract.balanceOf.call(wireInvestor);
        }).then(function(balance) {
        	assert.equal(balance.toNumber(), tokensNumber * Math.pow(10, 18), 'Wire investment wasn\' fixed');
        }).then(done);
    });

    it('Fix 10,000 TBX pre-ICO investment', function(done) {
        var contract;

        let investment = 10000; // 10,000 USD
        let tokenPriceInUsdCents = 100;
        let tokensNumber = investment; // 1 TBX = 1 USD


        Token.deployed().then(function(instance) {
            contract = instance;
            contract.preIcoInvestment(preICOInvestor, investment * 100, investment, { from: constants.owner });
        }).then(function(tx) {
            return contract.balanceOf.call(preICOInvestor);
        }).then(function(balance) {
        	assert.equal(balance.toNumber(), tokensNumber * Math.pow(10, 18), 'Pre-ICO investment wasn\' fixed');
        }).then(done);
    });

    it('Fix transfer from the old contract', function(done) {
        var contract;

        let amount = 10000 * Math.pow(10, 18); // 10,000 TBX
        let ethInvestorBalance, btcInvestorBalance;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.balanceOf.call(ethInvestor);
        }).then(function(balance) {
        	ethInvestorBalance = balance.toNumber();
        	return contract.balanceOf.call(btcInvestor);
        }).then(function(balance) {
        	btcInvestorBalance = balance.toNumber();
            contract.migrateTransfer(ethInvestor, btcInvestor, amount, 0x12345, { from: constants.owner });
        }).then(function(tx) {
            return contract.balanceOf.call(ethInvestor);
        }).then(function(balance) {
        	assert.approximately(balance.toNumber(), ethInvestorBalance - amount, Math.pow(10, 18), 'Transfer wasn\'t fixed');
        	return contract.balanceOf.call(btcInvestor);
        }).then(function(balance) {
        	assert.approximately(balance.toNumber(), btcInvestorBalance + amount, Math.pow(10, 18), 'Transfer wasn\'t fixed');
        }).then(done);
    });

    it('Finalise the ICO', function(done) {
        var contract;

        let totalSupply;
        let tokensSold = (wireInvestment + ethInvestment * ethToUsd + btcInvestment * btcToUsd) * Math.pow(10, 18) + constants.preIcoTokens;
        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.finaliseICO({ from: constants.owner });
        }).then(function(tx) {
            return contract.migrationCompleted.call();
        }).then(function(status) {
            assert.equal(status, true, 'ICO should be finalised');
            return contract.totalSupply.call();
        }).then(function(supply) {
        	totalSupply = supply.toNumber();
        	assert.equal(totalSupply * 0.75, tokensSold, "75% of token supply should be sold");
            return contract.balanceOf.call(constants.icoAllocation);
        }).then(function(balance) {
        	assert.equal(balance.toNumber(), 0, 'ICO allocation should be empty');
        	return contract.balanceOf.call(constants.foundationReserve);
        }).then(function(balance) {
        	assert.equal(balance.toNumber(), totalSupply * 0.125, 'Foundation reserve should receive 12.5% of total supply');
        	return contract.balanceOf.call(constants.multisig);
        }).then(function(balance) {
        	assert.equal(balance.toNumber(), totalSupply * 0.125, 'Multisig should receive 12.5% of total supply');
        }).then(done);
    });

});