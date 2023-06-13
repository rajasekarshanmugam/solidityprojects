<script setup>
import { ref } from "vue";
import { AUCTIONSTATE } from "@/stores/index.js";

const props = defineProps({
  auction: {
    type: Object,
    required: true,
  },
});
const auction = ref(props.auction);
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
        <div class="text-italic text-small text-muted">
          {{ AUCTIONSTATE[auction.state] }}
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
