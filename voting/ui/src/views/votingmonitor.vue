<script setup>
import { watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import candidate from "@/components/candidate.vue";
import { useRootStore } from "@/stores/index.js";

const store = useRootStore();
const reload = async () => {
  console.log("reloading -------");
  if (store.web3) {
    await store.loadVotingStatus();
    await store.loadVotingResults();
    await store.loadWinner();
  }
};

onMounted(reload);
const { connected } = storeToRefs(store);
watch(connected, async (newValue) => {
  if (newValue) await reload();
});
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
            <div class="my-3">
              <span class="h2">Voting Status</span>
              <button
                type="button"
                class="btn btn-small btn-success float-end"
                @click="reload"
              >
                <BootstrapIcon icon="arrow-clockwise" />
              </button>
            </div>
            <template v-if="store.votingState == 0">
              <div class="alert alert-primary" role="alert" style="height: 75px">
                Candidates are being registered
                <button
                  type="button"
                  class="btn btn-primary float-end"
                  @click="store.startVoting"
                >
                  Click here to start voting process
                </button>
              </div>
            </template>
            <template v-if="store.votingState == 1">
              <div class="alert alert-danger" role="alert" style="height: 75px">
                Voting in-progress
                <button
                  type="button"
                  class="btn btn-primary float-end"
                  @click="store.declareVotingResults"
                >
                  Click here to stop voting and declare winner
                </button>
              </div>
            </template>
            <template v-if="store.votingState == 2 && store.winner">
              <div class="alert alert-success" role="alert">
                <div class="row">
                  <div class="col-4">
                    Voting completed and winner has been announced <br /><br />
                    <candidate :candidate="store.winner" />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="row" v-if="store.votingState == 1">
        <div class="col-12">
          <div class="my-2">
            <div class="my-3">
              <span class="h2">Leadership Board</span>
              <button
                type="button"
                class="btn btn-small btn-success float-end"
                @click="reload"
              >
                <BootstrapIcon icon="arrow-clockwise" />
              </button>
            </div>
            <template v-if="store.votingState == 1 && store.votingResults">
              <div class="row row-cols-lg-4 row-cols-sm-4 .row-cols-md-3">
                <div
                  class="col"
                  v-for="(candidate, candidateIndex) in store.votingResults"
                  :key="candidateIndex"
                >
                  <candidate :candidate="candidate">
                    <template #body>
                      <div class="text-center" style="font-size: 3em">
                        {{ candidate.votes }}
                      </div>
                    </template>
                    <template #footer>&nbsp;</template>
                  </candidate>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
