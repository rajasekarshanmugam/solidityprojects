<script setup>
import { ref } from "vue";
import { useRootStore, AUCTIONSTATE } from "@/stores/index.js";

const store = useRootStore();
const itemName = ref('Lamps')
const itemUrl = ref('https://img.freepik.com/free-vector/vector-set-floor-table-lamps-with-black-nightstand-isolated-white-background_1284-48473.jpg?size=626&ext=jpg')
const itemDescription = ref('Donec et viverra lacus. Quisque sed iaculis enim. Cras maximus urna at velit lobortis euismod. Nullam elementum libero tempor ex tempus fringilla. Suspendisse feugiat lorem vel massa scelerisque dapibus. Aliquam eu nisi semper, placerat massa ullamcorper, posuere risus. Phasellus nunc arcu, interdum non convallis et, cursus vitae arcu. Donec porta molestie leo hendrerit convallis.')
const itemPrice = ref(1234)

const emit = defineEmits("onNewItem");
const addNewItem = async () => {
  await store.createAuction(itemName.value, itemUrl.value, itemDescription.value, itemPrice.value);
  emit("onNewItem");
};
</script>
<template>
  <div class="row row-cols-lg-4 row-cols-sm-4 .row-cols-md-3">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <div class="h5">New Auction Item</div>
          <hr />
          <form class="form-inline">
            <label class="sr-only">Item</label>
            <input
              type="text"
              class="form-control mb-2 mr-sm-2"
              v-model="itemName"
              placeholder="Item Name"
            />

            <label class="sr-only">Item Url</label>
            <input
              type="text"
              class="form-control mb-2 mr-sm-2"
              v-model="itemUrl"
              placeholder="Item Url"
            />

            <label class="sr-only">Item Description</label>
            <div class="input-group mb-2 mr-sm-2">
              <input
                type="text"
                class="form-control"
                v-model="itemDescription"
                placeholder="Item Description"
              />
            </div>

            <label class="sr-only">Minimum Price</label>
            <div class="input-group mb-2 mr-sm-2">
              <input
                type="text"
                class="form-control"
                v-model.number="itemPrice"
                placeholder="price"
              />
            </div>
          </form>
        </div>
        <div class="card-footer">
          <button
            type="button"
            class="btn btn-primary mb-2"
            @click="addNewItem"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
