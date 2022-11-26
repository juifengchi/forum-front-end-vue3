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
import usersAPI from "./../apis/users";
import { ref, watch } from "vue";
import { Toast } from "./../utils/helpers";
import { RouterLink } from "vue-router";

const props = defineProps({
  initialRestaurant: {
    type: Object,
    required: true,
  },
});

const restaurant = ref(props.initialRestaurant);
const isProcessing = ref(false);

watch(props.initialRestaurant, (newValue) => {
  restaurant.value = {
    ...restaurant.value,
    ...newValue,
  };
});

async function toggleFavorite(restaurantId) {
  try {
    isProcessing.value = true;
    const { data } = !restaurant.value.isFavorited
      ? await usersAPI.addFavorite({ restaurantId })
      : await usersAPI.deleteFavorite({ restaurantId });
    if (data.status !== "success") {
      throw new Error(data.message);
    }
    restaurant.value = {
      ...restaurant.value,
      isFavorited: !restaurant.value.isFavorited,
    };
    isProcessing.value = false;
  } catch (error) {
    isProcessing.value = false;
    const toastTitle = !restaurant.value.isFavorited
      ? "無法將餐廳加入最愛，請稍後再試"
      : "無法將餐廳移除最愛，請稍後再試";
    Toast.fire({
      icon: "error",
      title: toastTitle,
    });
    console.log("error", error);
  }
}

async function toggleLike(restaurantId) {
  try {
    isProcessing.value = true;
    const { data } = !restaurant.value.isLiked
      ? await usersAPI.addLike({ restaurantId })
      : await usersAPI.deleteLike({ restaurantId });
    if (data.status !== "success") {
      throw new Error(data.message);
    }
    restaurant.value = {
      ...restaurant.value,
      isLiked: !restaurant.value.isLiked,
    };
    isProcessing.value = false;
  } catch (error) {
    isProcessing.value = false;
    const toastTitle = !restaurant.value.isLiked
      ? "無法對餐廳按讚，請稍後再試"
      : "無法對餐廳取消讚，請稍後再試";
    Toast.fire({
      icon: "error",
      title: toastTitle,
    });
    console.log("error", error);
  }
}
</script>

<style scoped>
.col-lg-8 p,
.contact-info-wrap li,
.contact-info-wrap strong {
  font-family: serif;
  font-size: 17px;
}
</style>
