<template>
  <form @submit.stop.prevent="handleSubmit">
    <div class="form-group mb-4">
      <label for="text">留下評論：</label>
      <textarea v-model="text" class="form-control" rows="3" name="text" />
    </div>
    <div class="d-flex align-items-center justify-content-between">
      <button type="button" class="btn btn-link" @click="router.back()">
        回上一頁
      </button>
      <button type="submit" class="btn btn-primary mr-0">Submit</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { Toast } from "./../utils/helpers";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  restaurantId: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["after-create-comment"]);

const text = ref("");

const handleSubmit = () => {
  if (!text.value) {
    Toast.fire({
      icon: "warning",
      title: "請輸入評論",
    });
    return;
  }
  emit("after-create-comment", {
    restaurantId: props.restaurantId,
    text: text.value,
    action: "create",
  });
  text.value = "";
};
</script>

<style scoped>
.form-group {
  margin: 21px 0 8px;
}
</style>
