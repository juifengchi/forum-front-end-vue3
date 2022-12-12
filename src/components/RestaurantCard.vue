<template>
  <div class="col-md-6 col-lg-4">
    <div v-show="!isLoading" class="card mb-4">
      <!-- TODO: filter emptyImage -->
      <img
        class="card-img-top"
        :src="restaurant.image"
        alt="Card image cap"
        width="286"
        height="180"
        @load="changeLoading"
      />
      <div class="card-body">
        <p class="card-text title-wrap">
          <RouterLink
            :to="{ name: 'restaurant', params: { id: restaurant.id } }"
          >
            {{ restaurant.name }}
          </RouterLink>
        </p>
        <span class="badge badge-secondary">{{
          restaurant.Category?.name
        }}</span>
        <p class="card-text text-truncate">
          {{ restaurant.description }}
        </p>
      </div>
      <div class="card-footer">
        <button
          v-if="restaurant.isFavorited"
          type="button"
          class="btn btn-danger btn-border favorite mr-2"
          :disabled="isProcessing"
          @click.stop.prevent="toggleFavorite(restaurant.id)"
        >
          移除最愛
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary btn-border favorite mr-2"
          :disabled="isProcessing"
          @click.stop.prevent="toggleFavorite(restaurant.id)"
        >
          加到最愛
        </button>
        <button
          v-if="restaurant.isLiked"
          type="button"
          class="btn btn-danger like mr-2"
          :disabled="isProcessing"
          @click.stop.prevent="toggleLike(restaurant.id)"
        >
          Unlike
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary like mr-2"
          :disabled="isProcessing"
          @click.stop.prevent="toggleLike(restaurant.id)"
        >
          Like
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { ref } from "vue";
import { useRestaurant } from "../composables/useRestaurant";

const props = defineProps({
  initialRestaurant: {
    type: Object,
    required: true,
  },
});

const { restaurant, isProcessing, toggleFavorite, toggleLike } = useRestaurant(
  props.initialRestaurant
);

const isLoading = ref(true);
const changeLoading = () => {
  isLoading.value = false;
};
</script>

<style scoped>
.badge.badge-secondary {
  padding: 0;
  margin: 8px 0;
  color: #bd2333;
  background-color: transparent;
}

.btn,
.btn-border.btn:hover {
  margin: 7px 14px 7px 0;
}

.card {
  margin-bottom: 2rem !important;
}
.card-img-top {
  background-color: #efefef;
}

.card-body {
  padding: 17.5px;
}

.card-footer {
  padding: 9px 17.5px;
  border-color: rgb(232, 232, 232);
  background: white;
}
</style>
