<template>
  <div class="container py-5">
    <NavTabs />
    <Spinner v-if="isLoading" />
    <template v-else>
      <RestaurantsNavPills :categories="categories" />
      <div class="row">
        <RestaurantCard
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          :initial-restaurant="restaurant"
        />
      </div>
      <RestaurantPagination
        v-if="totalPage.length > 1"
        :current-page="currentPage"
        :total-page="totalPage"
        :category-id="categoryId"
        :previous-page="previousPage"
        :next-page="nextPage"
      />
      <div v-if="restaurants.length < 1">此類別目前無餐廳資料</div>
    </template>
  </div>
</template>

<script setup>
import NavTabs from "./../components/NavTabs.vue";
import RestaurantCard from "./../components/RestaurantCard.vue";
import RestaurantsNavPills from "./../components/RestaurantsNavPills.vue";
import RestaurantPagination from "./../components/RestaurantsPagination.vue";
import Spinner from "./../components/Spinner.vue";
import restaurantsAPI from "./../apis/restaurants";
import { Toast } from "./../utils/helpers";
import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

const route = useRoute();
const restaurants = ref([]);
const categories = ref([]);
const categoryId = ref(-1);
const currentPage = ref(1);
const totalPage = ref([]);
const previousPage = ref(-1);
const nextPage = ref(-1);
const isLoading = ref(true);

const { queryPage = "", queryCategoryId = "" } = route.query;
fetchRestaurants({ queryPage, queryCategoryId });

onBeforeRouteUpdate((to, from, next) => {
  const { page = "", categoryId = "" } = to.query;
  fetchRestaurants({ queryPage: page, queryCategoryId: categoryId });
  next();
});

async function fetchRestaurants({ queryPage, queryCategoryId }) {
  try {
    isLoading.value = true;
    const response = await restaurantsAPI.getRestaurants({
      page: queryPage,
      categoryId: queryCategoryId,
    });
    // const { restaurants, categories, categoryId, page, totalPage, prev, next } =
    //   response.data;
    // console.log(response.data);
    restaurants.value = response.data.restaurants;
    categories.value = response.data.categories;
    categoryId.value = response.data.categoryId;
    currentPage.value = response.data.page;
    totalPage.value = response.data.totalPage;
    previousPage.value = response.data.prev;
    nextPage.value = response.data.next;
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
