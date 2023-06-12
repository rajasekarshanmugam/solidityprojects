import { defineStore } from 'pinia'
import Web3 from '@/../node_modules/web3/dist/web3.min.js'
import ABIJson from './abi.json'

const TODOPRIORITY = {
  "LOW": 0,
  "NORMAL": 1,
  "HIGH": 2,
}

const useRootStore = defineStore('root', {
  state: () => {
    return {
      url: "http://127.0.0.1:7545",

      loadingContract: false,
      accounts: null,
      currentAccount: null,
      defaultGas: 307000,
      contractAddress: "0xF1259aDCcfDAB779d7d21F5C12E7AA2e5F776c0C",

      web3: null,
      todoContract: null,
      todos: []
    }
  },

  actions: {
    async connectAsync() {
      console.log('CONNECTING to url - ', this.url);
      try {
        this.loadingContract = true;
        const web3 = this.url != ''
          ? new Web3(new Web3.providers.HttpProvider(this.url))
          : new Web3(Web3.currentProvider);

        const accounts = await web3.eth.getAccounts();
        const todoContract = new web3.eth.Contract(ABIJson, this.contractAddress);

        this.web3 = web3;
        this.todoContract = todoContract;
        this.accounts = accounts;
        this.currentAccount = accounts[0];

        await this.loadTodos();
      }
      finally {
        this.loadingContract = false;
      }
    },

    async disconnectAsync() {
      this.web3 = null;
      this.accounts = null;
      this.todoContract = null;
    },

    async addNewTodo() {
      const t = {
        title: "TODO" + this.todos.length,
        category: "General",
        priority: TODOPRIORITY.NORMAL,
        iscompleted: false,
        isNew: true
      };
      this.todos.unshift(t);
    },

    async loadTodos() {
      console.log('loading todos...');
      const result = await this.todoContract.methods.getMyTodos().call(
        {
          from: this.currentAccount,
          gas: this.defaultGas
        }
      );
      this.todos = result.map(this.convertToTodo);
    },

    convertToTodo(r) {
      const { id, title, category, priority, owner, iscompleted } = r;
      return {
        id, title, category, priority, owner, iscompleted
      }
    },

    async markTodoDone(todo) {
      const result = await this.todoContract.methods.markCompleted(todo.id).send(
        {
          from: this.currentAccount,
          gas: this.defaultGas
        }
      );
      console.log('markTodoDone', result);
      todo.iscompleted = true;
      return result;
    },

    async saveTodo(todo) {
      if (todo.isNew) {
        const tx = await this.internalSaveTodo(todo);
        const blockNumber = tx.blockNumber;
        const events = await this.todoContract.getPastEvents("TaskCreated", { fromBlock: blockNumber, toBlock: blockNumber })
        const newTodo = this.convertToTodo(events[0].returnValues.todo)
        const todoIndex = this.todos.findIndex((t) => t == todo);
        if (todoIndex >= 0) {
          this.todos.splice(todoIndex, 1, newTodo);
        }
      } else {
        const tx = await this.internalUpdateTodo(todo);
        const blockNumber = tx.blockNumber;
        const events = await this.todoContract.getPastEvents("TaskUpdated", { fromBlock: blockNumber, toBlock: blockNumber })
        const newTodo = this.convertToTodo(events[0].returnValues.todo)
        const todoIndex = this.todos.findIndex((t) => t == todo);
        debugger;
        if (todoIndex >= 0) {
          this.todos.splice(todoIndex, 1, newTodo);
        }
      }
    },

    async internalSaveTodo(todo) {
      const { title, category, priority } = todo;
      const result = await this.todoContract.methods.addTodo(title, category, priority).send(
        {
          from: this.currentAccount,
          gas: this.defaultGas
        }
      );
      console.log('SAVERESULT', result);

      if (result) {
        alert("TODO saved");
      }
      return result;
    },

    async internalUpdateTodo(todo) {
      const { id, title, category, priority } = todo;
      const result = await this.todoContract.methods.updateTodo(id, title, category, priority).send(
        {
          from: this.currentAccount,
          gas: this.defaultGas
        }
      );
      console.log('UPDATERESULT', result);

      if (result) {
        alert("TODO updated");
      }
      return result;
    },
  },
})

export { useRootStore };