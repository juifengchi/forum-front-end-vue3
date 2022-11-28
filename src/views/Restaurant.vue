<template>
  <div class="container py-5">
    <Spinner v-if="isLoading" />
    <template v-else>
      <RestaurantDetail :initial-restaurant="restaurant" />
      <hr />
      <RestaurantComments
        :restaurant-comments="restaurant.comments"
        @after-delete-comment="afterHandleComment"
      />
      <CreateComment
        :restaurant-id="restaurant.id"
        @after-create-comment="afterHandleComment"
      />
    </template>
  </div>
</template>

<script setup>
import RestaurantDetail from "./../components/RestaurantDetail.vue";
import RestaurantComments from "./../components/RestaurantComments.vue";
import CreateComment from "./../components/CreateComment.vue";
import restaurantsAPI from "./../apis/restaurants";
import commentsAPI from "./../apis/comments";
import Spinner from "./../components/Spinner.vue";
import { Toast } from "./../utils/helpers";
import { ref, computed } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useUserStore } from "../store/userStore.js";

const restaurant = ref({
  id: -1,
  name: "",
  categoryName: "",
  image: "",
  openingHours: "",
  tel: "",
  address: "",
  description: "",
  isFavorited: false,
  isLiked: false,
  comments: [],
});
const isLoading = ref(true);

const userStore = useUserStore();
const currentUser = computed(() => userStore.currentUser);

const route = useRoute();
fetchRestaurant(route.params.id);

onBeforeRouteUpdate((to, from, next) => {
  fetchRestaurant(to.params.id);
  next();
});

async function fetchRestaurant(restaurantId) {
  try {
    isLoading.value = true;
    const { data } = await restaurantsAPI.getRestaurant({ restaurantId });
    const {
      id,
      name,
      image,
      tel,
      address,
      description,
      Category,
      opening_hours,
      Comments,
    } = data.restaurant;
    restaurant.value = {
      id,
      name,
      categoryName: Category ? Category.name : "未分類",
      image,
      openingHours: opening_hours,
      tel,
      address,
      description,
      isFavorited: data.isFavorited,
      isLiked: data.isLiked,
      comments: Comments,
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

async function afterHandleComment(payload) {
  try {
    const { data } =
      payload.action === "delete"
        ? await commentsAPI.deleteComment({ commentId: payload.commentId })
        : await commentsAPI.createComment(payload);
    if (data.status !== "success") {
      throw new Error(data.message);
    }
    if (payload.action === "delete") {
      restaurant.value.comments = restaurant.value.comments.filter(
        (comment) => comment.id !== payload.commentId
      );
    } else {
      restaurant.value.comments.push({
        id: data.commentId,
        RestaurantId: data.restaurantId,
        User: {
          id: currentUser.value.id,
          name: currentUser.value.name,
        },
        text: payload.text,
        createdAt: new Date(),
      });
    }
  } catch (error) {
    const toastTitle =
      payload.action === "delete"
        ? "無法移除評論，請稍後再試"
        : "無法新增評論，請稍後再試";
    Toast.fire({
      icon: "error",
      title: toastTitle,
    });
  }
}
</script>
