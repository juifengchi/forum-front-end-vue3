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
          restaurant.Category.name
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
import usersAPI from "./../apis/users";
import { RouterLink } from "vue-router";
import { ref } from "vue";
import { Toast } from "./../utils/helpers";

const props = defineProps({
  initialRestaurant: {
    type: Object,
    required: true,
  },
});

const restaurant = ref(props.initialRestaurant);
const isProcessing = ref(false);
const isLoading = ref(true);

function changeLoading() {
  isLoading.value = false;
}

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
