import usersAPI from "./../apis/users";
import { Toast } from "./../utils/helpers";
import { ref } from "vue";
// module export & import
// arrow function
export const useRestaurant = (initialState) => {
  // let & const to replace var
  const restaurant = ref(initialState);
  const isProcessing = ref(false);

  async function toggleFavorite(restaurantId) {
    try {
      isProcessing.value = true;
      // destructuring assignment
      const { data } = !restaurant.value.isFavorited
        ? await usersAPI.addFavorite({ restaurantId })
        : await usersAPI.deleteFavorite({ restaurantId });
      if (data.status !== "success") {
        throw new Error(data.message);
      }
      restaurant.value = {
        // spread operator
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
      // template literals
      console.log(`Error: ${error}`);
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
    } catch (error) {
      const toastTitle = !restaurant.value.isLiked
        ? "無法對餐廳按讚，請稍後再試"
        : "無法對餐廳取消讚，請稍後再試";
      Toast.fire({
        icon: "error",
        title: toastTitle,
      });
      console.log(`Error: ${error}`);
    } finally {
      isProcessing.value = false;
    }
  }

  return { restaurant, isProcessing, toggleFavorite, toggleLike };
};
