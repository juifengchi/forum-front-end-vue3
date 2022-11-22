<template>
  <form @submit.stop.prevent="handleSubmit">
    <div class="form-group mb-4">
      <label for="text">留下評論：</label>
      <textarea v-model="text" class="form-control" rows="3" name="text" />
    </div>
    <div class="d-flex align-items-center justify-content-between">
      <button type="button" class="btn btn-link" @click="$router.back()">回上一頁</button>
      <button type="submit" class="btn btn-primary mr-0">
        Submit
      </button>
    </div>
  </form>
</template>

<script>
import { Toast } from './../utils/helpers'

export default {
  name: 'CreateComment',
  data() {
    return {
      text: '',
    }
  },
  props: {
    restaurantId: {
      type: Number,
      required: true,
    },
  },
  methods: {
    handleSubmit() {
      if (!this.text) {
        Toast.fire({
          icon: 'warning',
          title: '請輸入評論',
        })
        return
      }
      this.$emit('after-create-comment', {
        restaurantId: this.restaurantId,
        text: this.text,
      })
      this.text = ''
    },
  },
}
</script>

<style scoped>
.form-group {
  margin: 21px 0 8px;
}
</style>
