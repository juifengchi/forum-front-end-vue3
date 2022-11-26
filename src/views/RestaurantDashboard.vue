<template>
  <div class="container py-5">
    <Spinner v-if="isLoading" />
    <template v-else>
      <div>
        <h1>{{ restaurant.name }}</h1>
        <span class="badge badge-secondary mt-1 mb-3">
          {{ restaurant.categoryName }}
        </span>
      </div>
      <hr />
      <ul>
        <li>評論數： {{ restaurant.commentsLength }}</li>
        <li>瀏覽次數： {{ restaurant.viewCounts }}</li>
      </ul>
      <button type="button" class="btn btn-link" @click="router.back()">
        回上一頁
      </button>
    </template>
  </div>
</template>

<script setup>
import restaurantsAPI from "./../apis/restaurants";
import Spinner from "./../components/Spinner.vue";
import { ref } from "vue";
import { Toast } from "./../utils/helpers";
import { useRoute, useRouter } from "vue-router";

const restaurant = ref({
  id: -1,
  name: "",
  categoryName: "",
  commentsLength: 0,
  viewCounts: 0,
});
const isLoading = ref(true);

const route = useRoute();
const router = useRouter();
fetchRestaurant(route.params.id);

async function fetchRestaurant(restaurantId) {
  try {
    isLoading.value = true;
    const { data } = await restaurantsAPI.getRestaurant({ restaurantId });
    const { id, name, Category, Comments, viewCounts } = data.restaurant;
    restaurant.value = {
      id,
      name,
      categoryName: Category.name,
      commentsLength: Comments.length,
      viewCounts,
    };
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    Toast.fire({
      icon: "error",
      title: "無法取得餐廳資料，請稍後再試",
    });
  }
}
</script>
