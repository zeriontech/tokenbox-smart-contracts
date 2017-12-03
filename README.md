<img width="360" alt="tokenbox" src="./assets/logo.svg">

# Tokenbox Smart Contracts
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![yarn](https://img.shields.io/badge/yarn-v1.2.1-yellow.svg)](https://yarnpkg.com/lang/en/docs/install/)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://github.com/nodejs/node)
[![truffle](https://img.shields.io/badge/truffle-v3.4.11-orange.svg)](https://truffle.readthedocs.io/en/latest/)
[![testrpc](https://img.shields.io/badge/testrpc-v4.0.1-yellowgreen.svg)](https://github.com/ethereumjs/testrpc)
[![solidity](https://img.shields.io/badge/solidity-docs-red.svg)](http://solidity.readthedocs.io/en/develop/types.html)

## Project description
Tokenbox is is an ecosystem for crypto-investors, traders & funds.

## Dependencies
We use [Truffle](http://truffleframework.com/) to compile, test and deploy smart contracts.

You will also need a running node with an active JSON-RPC (required). For testing purposes, we suggest using [TestRPC](https://github.com/ethereumjs/testrpc).
We strongly recommend you to use latest **node**, **npm**, and **yarn** versions.<br />

The environment can be set up by the command:
`yarn install`

For more information about Truffle visit [https://truffle.readthedocs.io/en/latest/](https://truffle.readthedocs.io/en/latest/).

## Usage
1. Install [Yarn](https://yarnpkg.com/lang/en/docs/install/)
2. `yarn install` - installs all npm packages.
3. `yarn compile` - to compile contracts.
4. In a separate tab and run `./serve/run_testrpc.sh`
5. `yarn run truffle test ./test/owned.js ./test/tokenbox_token.js` - runs tests

## Contracts on Etherscan
Token address:
//TODO Update
 [0xc438b4c0dfbb1593be6dee03bbd1a84bb3aa6213](https://etherscan.io/token/0xc438b4c0dfbb1593be6dee03bbd1a84bb3aa6213#readContract)

## Authors
<a href="https://zerion.io?utm_source=tokenbox_contracts"><img width="360" alt="Powered by Zerion" src="./assets/zerion.png"></a>
