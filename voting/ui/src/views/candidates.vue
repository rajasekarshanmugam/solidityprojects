<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRootStore } from "@/stores/index.js";
import candidate from "@/components/candidate.vue";

const newPartyName = ref("AIADMK");
const newPartyFlagUrl = ref(
  "https://www.flagcolorcodes.com/data/Flag-of-All-India-Anna-Dravida-Munnetra-Kazhagam.png"
);
const newCandidateAddress = ref("0x5aFBf3e899D194aa839d580160Ddd6A65b524132");

const store = useRootStore();
const reload = async () => {
  console.log("reloading -------");
  if (store.web3) {
    await store.loadCandidates();
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
            <span class="h2 pt-2">Candidates</span>
            <span class="float-end">
              <button
                type="button"
                class="btn btn-success ms-2"
                @click="store.loadCandidates()"
              >
                <BootstrapIcon icon="arrow-clockwise" />
              </button>

              <button
                type="button"
                class="btn btn-success ms-2"
                @click="store.addSomeCandidates()"
                title="add some sample candidates"
              >
                <BootstrapIcon icon="plus" />
              </button>
            </span>
          </div>
          <div class="row row-cols-lg-4 row-cols-sm-4 .row-cols-md-3">
            <div class="col">
              <div class="card">
                <div class="card-body">
                  <div class="h5">New Candidate Info</div>
                  <hr />
                  <form class="form-inline">
                    <label class="sr-only">Candidate Address</label>
                    <input
                      type="text"
                      class="form-control mb-2 mr-sm-2"
                      v-model="newCandidateAddress"
                      placeholder="Candidate address"
                    />

                    <label class="sr-only">Party Name</label>
                    <input
                      type="text"
                      class="form-control mb-2 mr-sm-2"
                      v-model="newPartyName"
                      placeholder="Party Name"
                    />

                    <label class="sr-only">Flag Url</label>
                    <div class="input-group mb-2 mr-sm-2">
                      <input
                        type="text"
                        class="form-control"
                        v-model="newPartyFlagUrl"
                        placeholder="party flag url"
                      />
                    </div>
                  </form>
                </div>
                <div class="card-footer">
                  <button
                    type="button"
                    class="btn btn-primary mb-2"
                    @click="
                      store.addNewCandidate(
                        newPartyName,
                        newPartyFlagUrl,
                        newCandidateAddress
                      )
                    "
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
            <div
              class="col"
              v-for="(candidate, candidateIndex) in store.candidates"
              :key="candidateIndex+candidate.partyname"
            >
              <candidate :candidate="candidate" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
