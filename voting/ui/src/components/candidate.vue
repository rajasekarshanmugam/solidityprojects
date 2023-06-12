<script setup>
import { ref } from "vue";
const props = defineProps({
  candidate: {
    type: Object,
    required: true,
  },
});
const candidate = ref(props.candidate);
</script>
<template>
  <div class="col">
    <div class="card">
      <img :src="candidate.partyflagurl" class="card-img-top" alt="party flag" />
      <div class="card-body">
        <div class="h5">{{ candidate.partyname }}</div>
        <slot name="body">
          <p class="card-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus gravida
            purus sed sodales convallis. Aliquam a nisl ante. Quisque nisi erat, feugiat
            ac viverra sed, volutpat eget ante.
          </p>
        </slot>
      </div>
      <slot name="footer">
        <div class="card-footer">
          <div class="text-italic text-small text-muted">
            {{ candidate.candidateaddress }}
          </div>
        </div>
      </slot>
      <slot name="postfooter"></slot>
    </div>
  </div>
</template>
