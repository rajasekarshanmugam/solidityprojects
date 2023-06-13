<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRootStore, AUCTIONSTATE } from "@/stores/index.js";
import auction from "@/components/auction.vue";

const store = useRootStore();

const myAuctions = ref({});

const reload = async () => {
  console.log("reloading -------");
  if (store.web3) {
    await store.loadAuctions();
    myAuctions.value = store.auctions.filter((a) => a.owner == store.currentAccount);
  }
};

onMounted(reload);
const { connected } = storeToRefs(store);
watch(connected, async (newValue) => {
  if (newValue) await reload();
});

const createDefaultAuctions = async () => {
  await store.createDefaultAuctions();
  await reload();
};
</script>
<template>
  <div v-if="!store.web3" class="alert alert-danger" role="alert">
    not connected to the server...
  </div>
  <template v-else>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="my-2">
            <span class="h2 pt-2">Auctions</span>
            <span class="float-end">
              <button
                type="button"
                class="btn btn-success ms-2"
                @click="reload()"
                title="refresh screen"
              >
                <BootstrapIcon icon="arrow-clockwise" />
              </button>
              <button
                type="button"
                class="btn btn-danger ms-2"
                @click="createDefaultAuctions()"
                title="create default auction items"
              >
                <BootstrapIcon icon="plus" />
              </button>
            </span>
            <hr />
          </div>
          <div class="h3 text-italic">My</div>
          <div class="row row-cols-lg-4 row-cols-sm-4 .row-cols-md-3">
            <template v-if="myAuctions && myAuctions.length">
              <div
                class="col"
                v-for="(auction, auctionIndex) in myAuctions"
                :key="auctionIndex + auction.id"
              >
                <auction :auction="auction" />
              </div>
            </template>
            <div v-else class="alert alert-warning w-100" role="alert">
              no auctions found
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
