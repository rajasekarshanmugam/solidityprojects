<script setup>
import { watch, ref, onMounted } from "vue";
import { useRootStore } from "@/stores/index.js";
const store = useRootStore();
</script>
<template>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Auction House</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                tag="a"
                class="nav-link"
                active-class="active"
                to="/myauctions"
                exact
                >My</router-link
              >
            </li>
          </ul>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                tag="a"
                class="nav-link"
                active-class="active"
                to="/auctions"
                exact
                >Auctions</router-link
              >
            </li>
          </ul>

          <form class="d-flex">
            <input
              v-if="!store.web3"
              class="form-control me-2"
              type="search"
              placeholder="server url"
              v-model="store.url"
            />
            <input
              v-if="!store.web3"
              class="form-control me-2"
              type="search"
              placeholder="contract address"
              v-model="store.contractAddress"
            />
            <select
              v-if="store.accounts"
              class="form-select me-2"
              aria-label="current account"
              v-model="store.currentAccount"
            >
              <option selected disabled>Pick Account</option>
              <option v-for="account in store.accounts">{{ account }}</option>
            </select>
            <input
              class="form-control me-2"
              type="search"
              placeholder="default gas"
              style="max-width: 100px"
              v-model="store.defaultGas"
            />
            <button
              v-if="!store.web3"
              class="btn btn-success"
              type="button"
              @click="store.connectAsync()"
            >
              Connect
            </button>
            <button
              v-else
              class="btn btn-danger"
              type="button"
              @click="store.disconnectAsync()"
            >
              Disconnect
            </button>
          </form>
        </div>
      </div>
    </nav>
    <main role="main" :key="store.currentAccount">
      <router-view />
    </main>
  </body>
</template>
