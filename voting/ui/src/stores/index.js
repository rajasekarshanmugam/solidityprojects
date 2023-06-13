import { defineStore } from 'pinia'
import Web3 from '@/../node_modules/web3/dist/web3.min.js'
import ABIJson from './abi.json'

const VOTINGSTATE = {
  "Onboarding": 0,
  "Voting": 1,
  "VotingCompleted": 2,
}

const useRootStore = defineStore('root', {
  state: () => {
    return {
      url: "http://127.0.0.1:7545",

      accounts: null,
      currentAccount: null,
      defaultGas: 307000,
      contractAddress: "0xb47A9FFcFa422c05Abf28B68249A2D5A3E0B1fF7",
      web3: null,
      connected: false,
      votingContract: null,

      candidates: [],
      votingState: VOTINGSTATE.Onboarding,
      myVote: { initialized: false },
      votingResults: null
    }
  },

  actions: {
    async connectAsync() {
      console.log('CONNECTING to url - ', this.url);
      const web3 = this.url != ''
        ? new Web3(new Web3.providers.HttpProvider(this.url))
        : new Web3(Web3.currentProvider);

      const accounts = await web3.eth.getAccounts();
      const votingContract = new web3.eth.Contract(ABIJson, this.contractAddress);

      this.web3 = web3;
      this.votingContract = votingContract;
      this.accounts = accounts;
      this.currentAccount = accounts[0];
      this.connected = web3 != null;
    },

    async disconnectAsync() {
      this.web3 = null;
      this.accounts = null;
      this.votingContract = null;
    },

    getCallInputs() {
      return {
        from: this.currentAccount, gas: this.defaultGas
      }
    },

    async loadCandidates() {
      console.log('loading candidates...');
      const result = await this.votingContract.methods.getCandidates().call(this.getCallInputs());
      console.log('candidates...', result);
      this.candidates = result.map(this.convertCandidate);
    },

    convertCandidate(r) {
      const { partyname, partyflagurl, candidateaddress } = r;
      return {
        partyname, partyflagurl, candidateaddress
      };
    },

    async loadMyVote() {
      console.log('loading my vote...');
      const result = await this.votingContract.methods.getMyVote().call(this.getCallInputs());
      console.log('my vote...', result);
      this.myVote = result ?? { initialized: false };
    },
    async loadVotingStatus() {
      console.log('loading voting status...');
      const result = await this.votingContract.methods._votingState().call(this.getCallInputs());
      console.log('voting status...', result);
      this.votingState = result;
    },
    async loadWinner() {
      console.log('loading winner...');
      const result = await this.votingContract.methods._winner().call(this.getCallInputs());
      this.winner = result;
    },

    async addNewCandidate(partyName, partyFlagUrl, candidateAddress) {
      console.log('addNewCandidate...');
      const tx = await this.votingContract.methods.addCandidate(partyName, partyFlagUrl, candidateAddress).send(this.getCallInputs());
      console.log('addNewCandidate', tx);

      if (tx) {
        alert("add candidate successful");
      }

      await this.loadCandidates();
    },

    async addSomeCandidates(){
      const accounts = this.accounts;
      await this.addNewCandidate("BJP", "https://www.flagcolorcodes.com/data/Flag-of-Bharatiya-Janata-Party.png", accounts[0]);
      await this.addNewCandidate("Congress", "https://www.flagcolorcodes.com/data/Flag-of-Indian-National-Congress.png", accounts[1]);
      await this.addNewCandidate("Trinamool Congress", "https://www.flagcolorcodes.com/data/Flag-of-All-India-Trinamool-Congress.png", accounts[2]);
    },

    async startVoting() {
      console.log('startVoting...');
      const tx = await this.votingContract.methods.startVoting().send(this.getCallInputs());
      console.log('startVoting', tx);
      if (tx) {
        alert("Voting has started");
      }
      await this.loadVotingStatus();
    },

    async castVote(candidateAddress) {
      console.log('castVote...');
      const tx = await this.votingContract.methods.vote(candidateAddress).send(this.getCallInputs());
      console.log('castVote', tx);
      if (tx) {
        alert("Your vote has been casted");
      }
      await this.loadVotingStatus();
    },

    async loadVotingResults() {
      console.log('loadVotingResults...');
      const results = await this.votingContract.methods.getVotingResults().call(this.getCallInputs());
      console.log('loadVotingResults', results);
      const votes = results[1];
      const candidates = results[0]
        .map((c, cindex) => {
          c = this.convertCandidate(c);
          c.votes = Number(votes[cindex]);
          return c;
        })
        .sort((a, b) => b.votes - a.votes);
      this.votingResults = candidates;
    },

    async declareVotingResults() {
      console.log('declareVotingResults...');
      const tx = await this.votingContract.methods.declareVotingResults().send(this.getCallInputs());
      console.log('declareVotingResults', tx);
      if (tx) {
        alert("Voting has stopped, winner will be announced");
      }

      await this.loadWinner();
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

export { useRootStore };