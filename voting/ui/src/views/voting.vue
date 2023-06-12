<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import candidate from "@/components/candidate.vue";
import { useRootStore } from "@/stores/index.js";

const store = useRootStore();
const reload = async () => {
  if (store.web3) {
    await store.loadVotingStatus();
    await store.loadMyVote();
    await store.loadCandidates();
  }
};

const votedAddress = ref("");
const castVote = async (address) => {
  await store.castVote(address);
  await reload();
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
              <span class="h2">Your Voting Status</span>
              <span class="float-end">
                <button
                  v-if="store.votingState == 1 && votedAddress"
                  type="button"
                  class="btn btn-danger ms-2"
                  @click="castVote(votedAddress)"
                >
                  <BootstrapIcon icon="arrow-right" /> Cast Vote
                  <BootstrapIcon icon="arrow-left" />
                </button>

                <button type="button" class="btn btn-success ms-2" @click="reload">
                  <BootstrapIcon icon="arrow-clockwise" />
                </button>
              </span>
            </div>
            <template v-if="store.myVote.initialized">
              <div class="alert alert-success" role="alert">
                <div class="row">
                  <div class="col-4">
                    You have already voted for the candidate <br /><br />
                    <candidate :candidate="store.myVote" />
                  </div>
                </div>
              </div>
            </template>
            <template v-else-if="store.votingState == 1">
              <div class="row row-cols-lg-4 row-cols-sm-4 .row-cols-md-3">
                <div
                  class="col"
                  v-for="(candidate, candidateIndex) in store.candidates"
                  :key="candidateIndex"
                >
                  <candidate :candidate="candidate">
                    <template #postfooter>
                      <div class="card-footer text-center">
                        <input
                          name="candidates"
                          type="radio"
                          v-model="votedAddress"
                          :value="candidate.candidateaddress"
                        />
                      </div>
                    </template>
                  </candidate>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="alert alert-danger" role="alert">
                Voting has not started, wait for voting to start and then cast the vote
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
