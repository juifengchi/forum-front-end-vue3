<template>
  <div class="container py-5">
    <Spinner v-if="isLoading" />
    <template v-else>
      <RestaurantDetail :initial-restaurant="restaurant" />
      <hr />
      <RestaurantComments
        :restaurant-comments="restaurantComments"
        @after-delete-comment="afterDeleteComment"
      />
      <CreateComment
        :restaurant-id="restaurant.id"
        @after-create-comment="afterCreateComment"
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
import { useStore } from "vuex";
import { Toast } from "./../utils/helpers";
import { ref, computed } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

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
});
const restaurantComments = ref([]);
const isLoading = ref(true);

const store = useStore();
const currentUser = computed(() => store.state.currentUser);

const route = useRoute();
const { id: restaurantId } = route.params;
fetchRestaurant(restaurantId);

onBeforeRouteUpdate((to, from, next) => {
  const { id: restaurantId } = to.params;
  fetchRestaurant(restaurantId);
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
    };
    restaurantComments.value = Comments;
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    Toast.fire({
      icon: "error",
      title: "無法取得餐廳資料，請稍後再試",
    });
  }
}

async function afterDeleteComment(commentId) {
  try {
    const { data } = await commentsAPI.deleteComment({ commentId });
    if (data.status !== "success") {
      throw new Error(data.message);
    }
    restaurantComments.value = restaurantComments.value.filter(
      (comment) => comment.id !== commentId
    );
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "無法移除評論，請稍後再試",
    });
  }
}

async function afterCreateComment(payload) {
  try {
    const { data } = await commentsAPI.createComment(payload);
    if (data.status !== "success") {
      throw new Error(data.message);
    }
    restaurantComments.value.push({
      id: data.commentId,
      RestaurantId: data.restaurantId,
      User: {
        id: currentUser.value.id,
        name: currentUser.value.name,
      },
      text: payload.text,
      createdAt: new Date(),
    });
  } catch (error) {
    Toast.fire({
      icon: "error",
      title: "無法新增評論，請稍後再試",
    });
  }
}
</script>
