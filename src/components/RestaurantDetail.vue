<template>
  <div class="row">
    <div class="col-md-12 mb-3">
      <h1>{{ restaurant.name }}</h1>
      <p class="badge badge-secondary mt-1 mb-3">
        {{ restaurant.categoryName }}
      </p>
    </div>
    <div class="col-lg-4">
      <!-- TODO: filter emptyImage -->
      <img
        class="img-responsive center-block"
        :src="restaurant.image"
        style="width: 250px; margin-bottom: 25px"
      />
      <div class="contact-info-wrap">
        <ul class="list-unstyled">
          <li>
            <strong>Opening Hour:</strong>
            {{ restaurant.openingHours }}
          </li>
          <li>
            <strong>Tel:</strong>
            {{ restaurant.tel }}
          </li>
          <li>
            <strong>Address:</strong>
            {{ restaurant.address }}
          </li>
        </ul>
      </div>
    </div>
    <div class="col-lg-8">
      <p>{{ restaurant.description }}</p>
      <RouterLink
        :to="{ name: 'restaurant-dashboard', params: { id: restaurant.id } }"
        class="btn btn-primary btn-border mr-2"
      >
        Dashboard
      </RouterLink>

      <button
        v-if="restaurant.isFavorited"
        type="button"
        class="btn btn-danger btn-border mr-2"
        :disabled="isProcessing"
        @click.stop.prevent="toggleFavorite(restaurant.id)"
      >
        移除最愛
      </button>
      <button
        v-else
        type="button"
        class="btn btn-primary btn-border mr-2"
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
</template>

<script setup>
import { watch } from "vue";
import { RouterLink } from "vue-router";
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

watch(props.initialRestaurant, (newValue) => {
  restaurant.value = {
    ...restaurant.value,
    ...newValue,
  };
});
</script>

<style scoped>
.col-lg-8 p,
.contact-info-wrap li,
.contact-info-wrap strong {
  font-family: serif;
  font-size: 17px;
}
</style>
