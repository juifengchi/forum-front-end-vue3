import Vuex from "vuex";
import usersAPI from "../apis/users";

export default Vuex.createStore({
  state: {
    currentUser: {
      id: -1,
      name: "",
      email: "",
      image: "",
      isAdmin: false,
    },
    isAuthenticated: false,
    token: "",
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        ...currentUser,
      };
      state.token = localStorage.getItem("token");
      state.isAuthenticated = true;
    },
    revokeAuthentication(state) {
      state.currentUser = {};
      state.isAuthenticated = false;
      state.token = "";
      localStorage.removeItem("token");
    },
  },
  actions: {
    // 在 actions 中可以透過參數的方式取得 commit 的方法
    async fetchCurrentUser({ commit }) {
      try {
        const { data } = await usersAPI.getCurrentUser();
        const { id, name, email, image, isAdmin } = data;
        commit("setCurrentUser", {
          id,
          name,
          email,
          image,
          isAdmin,
        });
        return true;
      } catch (error) {
        console.error(error.message);
        commit("revokeAuthentication");
        return false;
      }
    },
  },
  modules: {},
});
