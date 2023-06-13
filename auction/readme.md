# Auction House - web3 application to manage auctions


## Architecture:

We use a Vue based SPA to interact with the EVM directly(Ganache in our case) using web3js.

Once the SPA is "connected" to the client given the server url, we should be able to perform the options, switch accounts and visualize the results.

## Smart Contract:

Auction smart contract is located in the folder "smartcontracts". Its provides the following capabilities:

* manage auctions
* manage "my" auctions
* state diagram of the auction - states -
	- Created - auction item is created, but cannot bid yet
	- Started - auction is started by the seller, other users(not seller) can bid higher amounts
	- Frozen - owner of the auction, accepted the amount and awaiting pay from highest bidder
	- Closed - highest bidder does a buy out - transferring ether to the seller
* auction items are categorized by the auction state

## Compiling and Running the application:

* Start Ganache or other providers
* CD to ui folder and run the below commands

```shell
# install prerequisites
yarn install

# start dev server
vite

# navigate to the indicated url in a browser, its mostly - http://localhost:5173/
```

* Open Remix, open the TODO smart contract and deploy it to ganache. Copy the contract address and use it in the web user interface


## Walkthrough of the application:

![Screenshot](./snapshots/quickview.gif)


## Step by Step - Walkthrough of the application:

* Connect to EVM (Ganache was used for testing)
	- At the top of the screen we see the below controls in order, we need to configure that
		- remix to publish the smart contract (located in smartcontracts folder)
		- url (ganache in our case)
		- contract address (copied from remix after deployment)
		- default gas limit to use (wei)
		- contract addresses after we "connect"
		- click on "connect" after giving all the details

![Screenshot](./snapshots/1.png)

* Once we click on the "Connect" button, we should see the list of tasks. If there are no Todos, need to click on "+" to add new one as shown below.

* Follow above walk through to completely view all the screens and the steps
* note that the accounts drop down is used to switch as different users - sellers, buyers