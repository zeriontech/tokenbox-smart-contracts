let Token = artifacts.require('./TokenboxToken.sol');
let constants = require('./constants.js');
const increaseTime = require('./utils/time_travel');


contract('TokenboxToken.', function(accounts) {

    /*
     *  Verify that initial contract state matches with expected state
     */
    it('Should verify decimals', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.decimals.call();
        }).then(function(number) {
            assert.equal(number.toNumber(), constants.decimals, 'Decimals do not match');
        }).then(done);
    });

    it('Should verify total supply', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.totalSupply.call();
        }).then(function(supply) {
            assert.equal(supply.toNumber(), constants.totalSupply, 'Total supply is incorrect');
        }).then(done);
    });

    it('Should verify allocation address', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.icoAllocation.call();
        }).then(function(address) {
            assert.equal(address, constants.icoAllocation, 'Allocation address is incorrect');
        }).then(done);
    });

    it('Should verify allocation address balance', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.balanceOf.call(constants.icoAllocation);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), constants.allocationTokens,
                         'Allocation address balance is incorrect');
        }).then(done);
    });

    it('Should verify preICO allocation address', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.preIcoAllocation.call();
        }).then(function(address) {
            assert.equal(address, constants.preIcoAllocation, 'PreICO allocation address is incorrect');
        }).then(done);
    });

    it('Should verify preICO allocation address balance', function(done) {
            var contract;

            Token.deployed().then(function(instance) {
                contract = instance;
                return contract.balanceOf.call(constants.preIcoAllocation);
            }).then(function(balance) {
                assert.equal(balance.toNumber(), constants.preIcoTokens,
                             'PreICO allocation address balance is incorrect');
            }).then(done);
        });

    it('Should verify reserve address balance is zero in the beginning ICO', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.balanceOf.call(constants.foundationReserve);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 0,
                         'Reserve address balance is incorrect');
        }).then(done);
    });

    it('Should verify multisig address', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.multisig.call();
        }).then(function(address) {
            assert.equal(address, constants.multisig,
             'Multisig address on a contract doesn\'t match the one from the tests');
        }).then(done);
    });

    /*
     * Verify that contract functions work as expected
     */
    it('Should verify that no one but owner can change multisig', function(done) {
        var contract;
        const newMultisig = '0x1234567890123456789012345678901234567890';

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.changeMultisig(newMultisig, { from: constants.investor });
        }).then(function(tx) {
            throw new Error('Investor should not be able to call changeMultisig() function');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: revert');
        }).then(done);
    });

    it('Should verify that owner can change multisig', function(done) {
        var contract;
        const newMultisig = '0x1234567890123456789012345678901234567890';

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.changeMultisig(newMultisig, { from: constants.owner });
        }).then(function(tx) {
            return contract.multisig.call();
        }).then(function(multisig) {
            assert.equal(multisig, newMultisig, "Multisig address was supposed to be changed");
        }).then(done);
    });

    it('No one can withdraw from reserve address until one year', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.allowToWithdrawFromReserve({ from: constants.investor });
        }).catch(function(result){
            return contract.allowToWithdrawFromReserve({ from: constants.owner })
        }).catch(function(result){
            return contract.allowance(constants.foundationReserve, constants.investor);
        }).then(function(balance) {
            assert.equal(balance, 0, 'Allowance for investor of foundation reserve address is incorrect');
            return contract.allowance(constants.foundationReserve, constants.owner);
        }).then(function(balance) {
            assert.equal(balance, 0, 'Allowance for owner of foundation reserve address is incorrect');
        }).then(done);
    });

    it('No one but owner should be able to call preICOInvestment() function', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.preIcoInvestment(constants.investor, 100, 1, { from: constants.investor } );
        }).then(function(tx) {
            throw new Error('Investor should not be able to call preIcoDistribution() function');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: revert');
        }).then(done);
    });

    it('No one but owner should be able to call migrateTransfer() function', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.migrateTransfer(constants.investor, constants.investor, constants.investor1, 1, 
                                            { from: constants.investor });
        }).then(function(tx) {
            throw new Error('Investor should not be able to call migrateTransfer() function');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: revert');
        }).then(done);
    });

    it('No one but owner should be able to call wireInvestment() function', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.wireInvestment(constants.investor, 100, 100, { from: constants.investor });
        }).then(function(tx) {
            throw new Error('Investor should not be able to call wireInvestment() function');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: revert');
        }).then(done);
    });

    it('No one but owner should be able to call btcInvestment() function', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            let tokenPrice = Math.pow(10, 12);
            let btcToSatoshi = Math.pow(10, 8);
            let btcToUsd = 11000;
            return contract.btcInvestment(constants.investor, tokenPrice, 1 * btcToSatoshi, 'BTC_ADDRESS',
                                          btcToSatoshi / btcToUsd, { from: constants.investor });
        }).then(function(tx) {
            throw new Error('Investor should not be able to call btcInvestment() function');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: revert');
        }).then(done);
    });

    it('No one but owner should be able to call ethInvestment() function', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            let tokenPrice = Math.pow(10, 12);
            let ethToWei = Math.pow(10, 18);
            let ethToUsd = 450;

            return contract.ethInvestment(constants.investor, tokenPrice, 1 * ethToWei, 0x12345, ethToWei / ethToUsd,
                                          { from: constants.investor });
        }).then(function(tx) {
            throw new Error('Investor should not be able to call ethInvestment() function');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: revert');
        }).then(done);
    });

    it('No one but owner should be able to finalise the ICO', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.finaliseICO({ from: constants.investor });
        }).then(function(tx) {
            throw new Error('Investor should not be able to call finaliseICO() function');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: revert');
        }).then(done);
    });

    it('Owner should be able to finalise the ICO', function(done) {
        var contract;
        
        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.finaliseICO({ from: constants.owner });
        }).then(function(tx) {
            return contract.migrationCompleted.call();
        }).then(function(status) {
            assert.equal(status, true, 'ICO should be finalised');
        }).then(done);
    });

    it('ICO can be finalised only once', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.finaliseICO({ from: constants.owner });
        }).then(function(tx) {
            throw new Error('ICO can be finalised only once');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: revert');
        }).then(done);
    });

    it('Only owner can withdraw from reserve address after one year', function(done) {
        var contract;
        increaseTime(60 * 60 * 24 * 400);
        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.allowToWithdrawFromReserve({ from: constants.investor });
        }).catch(function(result){
            return contract.allowToWithdrawFromReserve({ from: constants.owner })
        }).then(function(tx) {
            return contract.allowance(constants.foundationReserve, constants.investor);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 0, 'Investor should not be allowed to withdraw tokens from the foundation reserve');
            return contract.allowance(constants.foundationReserve, constants.owner);
        }).then(function(balance) {
            let tokensSold = constants.preIcoTokens;
            let finalTotalSupply = tokensSold * 100 / 75; // 75% of all tokens were sold during the ICO
            let foundationTokens = finalTotalSupply * 0.125;  // 12.5% of total supply
            assert.equal(balance.toNumber(), foundationTokens, 'Owner should be allowed to withdraw tokens from the foundation reserve');
        }).then(done);
    });
});
