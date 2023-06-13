<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRootStore, AUCTIONSTATE } from "@/stores/index.js";
import auction from "@/components/auction.vue";
import newauction from "@/components/newauction.vue";
import groupBy from "lodash/groupBy";

const store = useRootStore();
const groupedAuctions = ref({});

const reload = async () => {
  console.log("reloading -------");
  if (store.web3) {
    await store.loadAuctions();
    const myAuctions = store.auctions.filter((a) => a.owner == store.currentAccount);
    groupedAuctions.value = groupBy(myAuctions, "state");
  }
};

onMounted(reload);
const { connected } = storeToRefs(store);
watch(connected, async (newValue) => {
  if (newValue) await reload();
});

const createNew = ref(false);

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
            <span class="h2 pt-2">My</span>
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
                @click="createNew = !createNew"
                title="create auction items"
              >
                <BootstrapIcon icon="plus" />
              </button>
              <button
                type="button"
                class="btn btn-danger ms-2"
                @click="createDefaultAuctions()"
                title="create default auction items"
              >
                <BootstrapIcon icon="plus" /><BootstrapIcon icon="plus" />
              </button>
            </span>
            <hr />
          </div>
          <newauction v-if="createNew" @onNewItem="reload" />
          <template v-for="(agroup, astate) in groupedAuctions">
            <div class="h3 text-italic">{{ AUCTIONSTATE[astate] }}</div>
            <div id="vueinstance" class="container">
              <div
                v-masonry="vueinstance"
                transition-duration="0.3s"
                item-selector=".item"
              >
                <div class="row">
                  <div
                    v-masonry-tile
                    class="item col-sm-3"
                    v-for="(auction, auctionIndex) in agroup"
                    :key="auctionIndex + auction.id"
                  >
                    <auction :auction="auction" />
                    <br />
                    &nbsp;
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>
</template>
