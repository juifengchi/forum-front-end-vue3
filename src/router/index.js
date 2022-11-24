import { createRouter, createWebHistory } from "vue-router";
import NotFound from "../views/NotFound.vue";
import SignIn from "../views/SignIn.vue";
import Restaurants from "../views/Restaurants.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../store/userStore.js";

const authorizeIsAdmin = (to, from) => {
  const { currentUser } = storeToRefs(useUserStore());
  const currentUserInStore = currentUser.value;
  if (currentUserInStore && !currentUserInStore.isAdmin) {
    return { name: "not-found" };
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active-link",
  linkExactActiveClass: "exact-active-link",
  routes: [
    {
      path: "/",
      name: "root",
      redirect: "/signin",
    },
    {
      path: "/signin",
      name: "sign-in",
      component: SignIn,
    },
    {
      path: "/signup",
      name: "sign-up",
      component: () => import("../views/SignUp.vue"),
    },
    {
      path: "/restaurants",
      name: "restaurants",
      component: Restaurants,
    },
    {
      path: "/restaurants/feeds",
      name: "restaurants-feeds",
      component: () => import("../views/RestaurantsFeeds.vue"),
    },
    {
      path: "/restaurants/top",
      name: "restaurants-tops",
      component: () => import("../views/RestaurantsTop.vue"),
    },
    {
      path: "/restaurants/:id",
      name: "restaurant",
      component: () => import("../views/Restaurant.vue"),
    },
    {
      path: "/restaurants/:id/dashboard",
      name: "restaurant-dashboard",
      component: () => import("../views/RestaurantDashboard.vue"),
    },
    {
      path: "/users/top",
      name: "users-top",
      component: () => import("../views/UsersTop.vue"),
    },
    {
      path: "/users/:id/edit",
      name: "user-edit",
      component: () => import("../views/UserEdit.vue"),
    },
    {
      path: "/users/:id",
      name: "user",
      component: () => import("../views/User.vue"),
    },
    {
      path: "/admin",
      exact: true,
      redirect: "/admin/restaurants",
    },
    {
      path: "/admin/restaurants",
      name: "admin-restaurants",
      component: () => import("../views/AdminRestaurants.vue"),
      beforeEnter: authorizeIsAdmin,
    },
    {
      path: "/admin/restaurants/new",
      name: "admin-restaurant-new",
      component: () => import("../views/AdminRestaurantNew.vue"),
      beforeEnter: authorizeIsAdmin,
    },
    {
      path: "/admin/restaurants/:id/edit",
      name: "admin-restaurant-edit",
      component: () => import("../views/AdminRestaurantEdit.vue"),
      beforeEnter: authorizeIsAdmin,
    },
    {
      path: "/admin/restaurants/:id",
      name: "admin-restaurant",
      component: () => import("../views/AdminRestaurant.vue"),
      beforeEnter: authorizeIsAdmin,
    },
    {
      path: "/admin/categories",
      name: "admin-categories",
      component: () => import("../views/AdminCategories.vue"),
      beforeEnter: authorizeIsAdmin,
    },
    {
      path: "/admin/users",
      name: "admin-users",
      component: () => import("../views/AdminUsers.vue"),
      beforeEnter: authorizeIsAdmin,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFound,
    },
  ],
});

router.beforeEach(async (to, from) => {
  const { fetchCurrentUser } = useUserStore();
  const { isAuthenticated, token } = storeToRefs(useUserStore());
  const tokenInLocalStorage = localStorage.getItem("token");
  const tokenInStore = token.value;
  let isAuthenticatedInStore = isAuthenticated.value;
  // 比較 localStorage 和 store 中的 token 是否一樣
  if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
    isAuthenticatedInStore = await fetchCurrentUser();
  }
  // 對於不需要驗證 token 的頁面
  const pathsWithoutAuthentication = ["sign-up", "sign-in"];
  // 如果 token 無效且進入需要驗證的頁面則轉址到登入頁
  if (
    !isAuthenticatedInStore &&
    !pathsWithoutAuthentication.includes(to.name)
  ) {
    return { name: "sign-in" };
  }
  // 如果 token 有效且進入不需要驗證到頁面則轉址到餐廳首頁
  if (isAuthenticatedInStore && pathsWithoutAuthentication.includes(to.name)) {
    return { name: "restaurants" };
  }
});

export default router;
