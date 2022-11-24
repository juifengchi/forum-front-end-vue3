import usersAPI from "../apis/users";
import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const currentUser = ref({
    id: -1,
    name: "",
    email: "",
    image: "",
    isAdmin: false,
  });
  const isAuthenticated = ref(false);
  const token = ref("");

  async function fetchCurrentUser() {
    try {
      const { data } = await usersAPI.getCurrentUser();
      const { id, name, email, image, isAdmin } = data;
      setCurrentUser({ id, name, email, image, isAdmin });
      return true;
    } catch (error) {
      console.error(error.message);
      revokeAuthentication();
      return false;
    }
  }

  function setCurrentUser(userInfo) {
    currentUser.value = {
      ...currentUser.value,
      ...userInfo,
    };
    token.value = localStorage.getItem("token");
    isAuthenticated.value = true;
  }

  function revokeAuthentication() {
    currentUser.value = {};
    isAuthenticated.value = false;
    token.value = "";
    localStorage.removeItem("token");
  }

  return {
    currentUser,
    isAuthenticated,
    token,
    fetchCurrentUser,
    setCurrentUser,
    revokeAuthentication,
  };
});
