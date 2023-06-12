<script setup>
import { watch, ref, onMounted } from "vue";
import { useRootStore } from "@/stores/index.js";
const store = useRootStore();
</script>
<template>
  <body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">TODOs</a>
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
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link tag="a" class="nav-link" active-class="active" to="/" exact
                >Home</router-link
              >
            </li>
          </ul>
          <form class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="server url"
              v-model="store.url"
            />
            <input
              class="form-control me-2"
              type="search"
              placeholder="contract address"
              v-model="store.contractAddress"
            />
            <select
              v-if="store.accounts"
              class="form-select me-2"
              aria-label="Default select example"
              v-model="store.currentAccount"
            >
              <option selected disabled>Pick Account</option>
              <option v-for="account in store.accounts">{{ account }}</option>
            </select>
            <input
              class="form-control me-2"
              type="search"
              placeholder="default gas"
              v-model="store.defaultGas"
            />
            <button
              v-if="!store.web3"
              class="btn btn-outline-success"
              type="button"
              @click="store.connectAsync()"
            >
              Connect
            </button>
            <button
              v-else
              class="btn btn-outline-success"
              type="button"
              @click="store.disconnectAsync()"
            >
              Disconnect
            </button>
          </form>
        </div>
      </div>
    </nav>
    <main role="main">
      <router-view />
    </main>
  </body>
</template>
