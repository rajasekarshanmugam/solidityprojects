<script setup>
import { watch, ref, onMounted } from "vue";
import { useRootStore } from "@/stores/index.js";
const store = useRootStore();
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
            <span class="h2 pt-2">My TODOs</span>
            <span class="float-end">
              <button type="button" class="btn btn-success" @click="store.addNewTodo()">
                <BootstrapIcon icon="plus" />
              </button>
              <button
                type="button"
                class="btn btn-success ms-2"
                @click="store.loadTodos()"
              >
                <BootstrapIcon icon="arrow-clockwise" />
              </button>
            </span>
          </div>
          <div class="accordion pt-3" id="acc">
            <div
              class="accordion-item pe-1 mb-1"
              v-for="(todo, todoIndex) in store.todos"
              :key="todoIndex"
            >
              <h2 class="accordion-header">
                <button
                  :class="['accordion-button w-100', { collapsed: todoIndex > 0 }]"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#' + 'htodo' + todoIndex"
                >
                  <span class="pe-2">
                    <BootstrapIcon
                      v-if="todo.iscompleted"
                      icon="check-lg"
                      title="done"
                      style="color: green"
                    />
                    <BootstrapIcon
                      v-else
                      icon="hourglass"
                      title="pending"
                      style="color: orange"
                    />
                  </span>
                  <span class="pe-2">
                    <BootstrapIcon
                      v-if="todo.priority == 2"
                      icon="arrow-up"
                      style="color: red"
                    />
                    <BootstrapIcon
                      v-else-if="todo.priority == 0"
                      icon="arrow-down"
                      style="color: gray"
                    />
                    <BootstrapIcon v-else icon="arrow-right-short" style="color: blue" />
                  </span>
                  <div>{{ todo.category }} - {{ todo.title }}</div>
                </button>
              </h2>
              <div :id="'htodo' + todoIndex" :class="['accordion-collapse collapse']">
                <div class="accordion-body">
                  <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="todo title"
                      v-model="todo.title"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Category</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="category"
                      v-model="todo.category"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Priority</label>
                    <select
                      class="form-control"
                      placeholder="category"
                      v-model="todo.priority"
                    >
                      <option value="0">LOW</option>
                      <option selected value="1">NORMAL</option>
                      <option value="2">HIGH</option>
                    </select>
                  </div>
                </div>
                <div class="footer px-2 pb-2">
                  <button
                    v-if="todo.isNew"
                    class="btn btn-success me-2"
                    @click="store.saveTodo(todo)"
                  >
                    <BootstrapIcon icon="save2" />
                    Save
                  </button>
                  <button
                    v-else
                    class="btn btn-success me-2"
                    @click="store.saveTodo(todo)"
                  >
                    <BootstrapIcon icon="save2" />
                    Update
                  </button>
                  <button
                    v-if="!todo.isNew && !todo.iscompleted"
                    class="btn btn-success me-2"
                    @click="store.markTodoDone(todo)"
                  >
                    <BootstrapIcon icon="check" />
                    Mark Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>
