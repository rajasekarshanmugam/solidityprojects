import { defineStore } from 'pinia'
import Web3 from '@/../node_modules/web3/dist/web3.min.js'
import ABIJson from './abi.json'

const AUCTIONSTATE = {
  "Created": 0,
  "Started": 1,
  "Frozen": 2,
  "Closed": 3,

  0: "Created",
  1: "Started",
  2: "Frozen",
  3: "Closed",
}

const useRootStore = defineStore('root', {
  state: () => {
    return {
      url: "http://127.0.0.1:7545",

      accounts: null,
      currentAccount: null,
      defaultGas: 3000000,
      contractAddress: "0x112f2565c673b4ea5E24ab989f704CAF0aa331a8",
      web3: null,
      connected: false,
      auctionContract: null,

      auctions: []
    }
  },

  actions: {
    async connectAsync() {
      console.log('CONNECTING to url - ', this.url);
      const web3 = this.url != ''
        ? new Web3(new Web3.providers.HttpProvider(this.url))
        : new Web3(Web3.currentProvider);

      const accounts = await web3.eth.getAccounts();
      const auctionContract = new web3.eth.Contract(ABIJson, this.contractAddress);

      this.web3 = web3;
      this.auctionContract = auctionContract;
      this.accounts = accounts;
      this.currentAccount = accounts[0];
      this.connected = web3 != null;
    },

    async disconnectAsync() {
      this.web3 = null;
      this.accounts = null;
      this.auctionContract = null;
    },

    getCallInputs() {
      return {
        from: this.currentAccount, gas: this.defaultGas
      }
    },

    async loadAuctions() {
      console.log('loading auctions...');
      const result = await this.auctionContract.methods.getAuctions().call(this.getCallInputs());
      console.log('auctions...', result);
      this.auctions = result.map(this.convertAuction);
    },

    convertAuction(r) {
      const { id, itemName, itemUrl, itemDescription, minimumPriceWei, owner, state, winningBidder, winningBidPriceWei } = r;
      return {
        id: Number(id), 
        itemName, itemUrl, itemDescription, 
          minimumPriceWei: Number(minimumPriceWei), 
          owner, winningBidder,
          state: Number(state),
          winningBidPriceWei: Number(winningBidPriceWei)
      };
    },

    async createDefaultAuctions() {
      await this.createAuction
        (
          "Watch 1",
          "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus gravida purus sed sodales convallis. Aliquam a nisl ante. Quisque nisi erat, feugiat ac viverra sed, volutpat eget ante. Integer sit amet elit libero. Donec eleifend nec nibh a varius. Proin et erat mollis urna maximus ultrices. Vestibulum ac arcu nec turpis pellentesque pellentesque vitae vel dolor. Sed suscipit leo ipsum, eu dapibus diam imperdiet ut",
          1000
        );
      await this.createAuction
        (
          "Watch 2",
          "https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus gravida purus sed sodales convallis. Aliquam a nisl ante. Quisque nisi erat, feugiat ac viverra sed, volutpat eget ante. Integer sit amet elit libero. Donec eleifend nec nibh a varius. Proin et erat mollis urna maximus ultrices. Vestibulum ac arcu nec turpis pellentesque pellentesque vitae vel dolor. Sed suscipit leo ipsum, eu dapibus diam imperdiet ut",
          2000
        );

        await this.createAuction
        (
          "Laptop 1",
          "https://clipart-library.com/images/BTaK6dXkc.png",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus gravida purus sed sodales convallis. Aliquam a nisl ante. Quisque nisi erat, feugiat ac viverra sed, volutpat eget ante. Integer sit amet elit libero. Donec eleifend nec nibh a varius. Proin et erat mollis urna maximus ultrices. Vestibulum ac arcu nec turpis pellentesque pellentesque vitae vel dolor. Sed suscipit leo ipsum, eu dapibus diam imperdiet ut",
          3500
        );

        await this.createAuction
        (
          "Laptop 2",
          "https://clipart-library.com/images/BcaK6dXLi.jpg",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus gravida purus sed sodales convallis. Aliquam a nisl ante. Quisque nisi erat, feugiat ac viverra sed, volutpat eget ante. Integer sit amet elit libero. Donec eleifend nec nibh a varius. Proin et erat mollis urna maximus ultrices. Vestibulum ac arcu nec turpis pellentesque pellentesque vitae vel dolor. Sed suscipit leo ipsum, eu dapibus diam imperdiet ut",
          3570
        );
    },

    async createAuction(itemName, itemUrl, itemDescription, price) {
      console.log('creating auction...', itemName);
      const result = await this.auctionContract.methods.createAuction(itemName, itemUrl, itemDescription, price).send(this.getCallInputs());
      console.log('auctions...', result);
    },

    async startBidding(id) {
      console.log('startBidding...', id);
      const result = await this.auctionContract.methods.startBidding(id).send(this.getCallInputs());
      console.log('startBidding...', result);
    },

    async bid(id, price) {
      console.log('bid...', id, price);
      const result = await this.auctionContract.methods.bid(id, price).send(this.getCallInputs());
      console.log('bid...', result);
    },

    async freezeBid(id) {
      console.log('freezeBid...', id);
      const result = await this.auctionContract.methods.freezeAuction(id).send(this.getCallInputs());
      console.log('freezeBid...', result);
    },

    async buyOut(id) {
      console.log('buyOut...', id);
      const result = await this.auctionContract.methods.buyAndConfirmSale(id).send(this.getCallInputs());
      console.log('buyOut...', result);
    },

    toObject(o) {
      return JSON.parse(
        JSON.stringify(
          o,
          (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
        )
      );
    },
  },
})

export { useRootStore, AUCTIONSTATE };