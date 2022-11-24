<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <RouterLink class="navbar-brand" to="/"> 餐廳評論網 </RouterLink>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <div id="navbarSupportedContent" class="navbar-collapse collapse">
      <div class="ml-auto d-flex align-items-center">
        <!-- is user is admin -->
        <RouterLink
          v-if="currentUser.isAdmin"
          to="/admin"
          class="text-white mr-3"
        >
          管理員後台
        </RouterLink>
        <!-- is user is login -->
        <template v-if="isAuthenticated">
          <RouterLink
            :to="{ name: 'user', params: { id: currentUser.id } }"
            class="text-white mr-3"
          >
            {{ currentUser.name || "使用者" }} 您好
          </RouterLink>
          <button
            type="button"
            class="btn btn-sm btn-outline-success my-2 my-sm-0"
            @click="logout"
          >
            登出
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useUserStore } from "../store/userStore.js";

const router = useRouter();
const userStore = useUserStore();
const { revokeAuthentication } = userStore;
const currentUser = computed(() => userStore.currentUser);
const isAuthenticated = computed(() => userStore.isAuthenticated);

function logout() {
  revokeAuthentication();
  router.push("/signin");
}
</script>

<style scoped>
.navbar-toggler {
  min-width: 70px;
  margin-right: 0;
}

nav.bg-dark {
  padding: 14px 16px;
  background-color: #bd2333 !important;
}

.navbar-brand {
  font-size: 19px;
  padding: 0;
}
</style>
