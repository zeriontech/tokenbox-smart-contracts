let Token = artifacts.require('./TokenboxToken.sol');
let constants = require('./constants.js');

contract('Owned.', function(accounts) {

    it('Should verify initial owner', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.owner.call();
        }).then(function(address) {
            assert.equal(address, constants.owner, 'Owners do not match');
        }).then(done);
    });

    it('No one but owner should be able to call setOwner() function', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.setOwner(constants.newOwner, { from: constants.investor });
        }).then(function(tx) {
            throw new Error('investor should not be able to call setOwner() function');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: revert');
        }).then(done);
    });

    it('Should set potential owner', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.setOwner(constants.newOwner, { from: constants.owner });
        }).then(function(tx) {
            return contract.potentialOwner.call();
        }).then(function(address) {
            assert.equal(address, constants.newOwner, 'Potential owner was not set');
        }).then(done);
    });

    it('No one but potential owner should be able to confirm the ownership', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.confirmOwnership({ from: constants.investor });
        }).then(function(tx) {
            throw new Error('investor should not be able to confirm ownership');
        }).catch(function(err) {
            assert.equal(err.message, 'VM Exception while processing transaction: revert');
        }).then(done);
    });

    it('Should confirm ownership', function(done) {
        var contract;

        Token.deployed().then(function(instance) {
            contract = instance;
            return contract.confirmOwnership({ from: constants.newOwner });
        }).then(function(tx) {
            return contract.owner.call();
        }).then(function(address) {
            assert.equal(address, constants.newOwner, 'Owner was not changed');
            return contract.potentialOwner.call();
        }).then(function(address) {
            assert.equal(address, 0, 'Potential owner was not deleted');
        }).then(done);
    });

});
