<script setup>
import { ref } from "vue";
import { useRootStore, AUCTIONSTATE } from "@/stores/index.js";

const store = useRootStore();
const props = defineProps({
  auction: {
    type: Object,
    required: true,
  },
});
const auction = ref(props.auction);
const bidAmount = ref(auction.value.winningBidPriceWei);
const minBidAmount = ref(auction.value.winningBidPriceWei);
console.log("auction", auction.value);

const startBidding = async () => {
  await store.startBidding(auction.value.id);
  alert("bidding started for the item successfully");
};

const bid = async () => {
  await store.bid(auction.value.id, bidAmount.value);
  alert("bid for specified price successfully");
};

const freezeBid = async () => {
  await store.freezeBid(auction.value.id);
  alert("bidding frozen for the item successfully");
};

const buyOut = async () => {
  await store.buyOut(auction.value.id);
  alert("item bought out successfully");
};
</script>
<template>
  <div class="card">
    <div class="pricecontainer">
      <img :src="auction.itemUrl" class="card-img-top" alt="party flag" />
      <div class="price">{{ auction.winningBidPriceWei }} $</div>
    </div>
    <div class="card-header">
      <div class="h5">{{ auction.itemName }}</div>
    </div>
    <div class="card-body">
      <slot name="body">
        <p class="card-text description">
          {{ auction.itemDescription }}
        </p>
      </slot>
    </div>
    <slot name="footer">
      <div class="card-footer">
        <!-- CREATED -->
        <div v-if="auction.state == 0 && auction.owner == store.currentAccount">
          <span class="text-italic text-small text-muted">
            {{ AUCTIONSTATE[auction.state] }}
          </span>
          <span class="float-end">
            <button type="button" class="btn btn-success" @click="startBidding">
              Start Bidding
            </button>
          </span>
        </div>

        <!-- STARTED -->
        <div v-else-if="auction.state == 1 && auction.owner != store.currentAccount">
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              v-model="bidAmount"
              placeholder="bid amount"
              :min="minBidAmount"
            />
            <button type="button" class="btn btn-success" @click="bid">Bid</button>
          </div>
        </div>
        <div v-else-if="auction.state == 1 && auction.owner == store.currentAccount">
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              v-model="bidAmount"
              placeholder="bid amount"
              readonly
            />
            <button type="button" class="btn btn-success" @click="freezeBid">Freeze</button>
          </div>
        </div>

        <!-- FROZEN -->
        <div v-else-if="auction.state == 2 && auction.owner == store.currentAccount">
          <div class="input-group">
            <input
              type="number"
              class="form-control"
              v-model="bidAmount"
              placeholder="bid amount"
              readonly
            />
            <button type="button" class="btn btn-success" @click="buyOut">Buy Out</button>
          </div>
        </div>

        <div v-else>
          <span class="text-italic text-small text-muted">
            {{ AUCTIONSTATE[auction.state] }}
          </span>
        </div>
      </div>
    </slot>
    <slot name="postfooter"></slot>
  </div>
</template>
<style scoped>
.pricecontainer {
  position: relative;
}
.price {
  position: absolute;
  width: 100%;
  right: 0;
  bottom: 0;
  color: white;
  font-size: 2.5em;
  text-align: right;
  padding: 0;
  margin: 0;

  background: #000000 !important;
  filter: alpha(opacity=60);
  -moz-opacity: 0.6;
  opacity: 0.6;
}

.description {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* number of lines to show */
  line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>
