<template>
  <div>
    <h2 class="my-4">所有評論：</h2>
    <div v-for="comment in restaurantComments" :key="comment.id">
      <blockquote class="blockquote mb-0">
        <button
          v-if="currentUser.isAdmin"
          type="button"
          class="btn btn-danger float-right"
          @click.stop.prevent="handleDeleteButtonClick(comment.id)"
        >
          Delete
        </button>
        <h3>
          <RouterLink :to="{ name: 'user', params: { id: comment.User.id } }">
            {{ comment.User.name }}
          </RouterLink>
        </h3>
        <p>{{ comment.text }}</p>
        <footer class="blockquote-footer">
          <!-- TODO: filter fromNow -->
          {{ comment.createdAt }}
        </footer>
      </blockquote>
      <hr />
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { RouterLink } from "vue-router";

defineProps({
  restaurantComments: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["after-delete-comment"]);

const store = useStore();
const currentUser = computed(() => store.state.currentUser);

function handleDeleteButtonClick(commentId) {
  emit("after-delete-comment", commentId);
}
</script>

<style scoped>
h2.my-4 {
  margin-bottom: 1rem !important;
  font-size: 18px;
}

h3 {
  margin-bottom: 3px;
  line-height: 1.3;
}

.blockquote-footer {
  font-size: 12.5px;
}
</style>
