<template>
  <div class="container py-5">
    <form class="w-100" @submit.prevent.stop="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">Sign In</h1>
      </div>
      <div class="form-label-group mb-2">
        <label for="email">email</label>
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          class="form-control"
          placeholder="email"
          autocomplete="username"
          required
          autofocus
        />
      </div>
      <div class="form-label-group mb-3">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          name="password"
          type="password"
          class="form-control"
          placeholder="Password"
          autocomplete="current-password"
          required
        />
      </div>
      <button
        class="btn btn-lg btn-primary btn-block mb-3"
        type="submit"
        :disabled="isProcessing"
      >
        {{ isProcessing ? "Processing..." : "Submit" }}
      </button>
      <div class="text-center mb-3">
        <p>
          <RouterLink to="/signup"> Sign Up </RouterLink>
        </p>
      </div>
      <p class="mt-5 mb-3 text-muted text-center">&copy; 2017-2018</p>
    </form>
  </div>
</template>

<script>
import authorizationAPI from "./../apis/authorization";
import { ref } from "vue";
import { Toast } from "./../utils/helpers";
import { useRouter, RouterLink } from "vue-router";
import { useUserStore } from "../store/userStore";

export default {
  setup() {
    const { setCurrentUser } = useUserStore();
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const isProcessing = ref(false);

    async function handleSubmit(e) {
      try {
        if (!email.value || !password.value) {
          Toast.fire({
            icon: "warning",
            title: "請填入 email 和 password",
          });
          return;
        }
        isProcessing.value = true;
        // 使用 authorizationAPI 的 signIn 方法並且帶入使用者填寫的 email 和 password
        const response = await authorizationAPI.signIn({
          email: email.value,
          password: password.value,
        });
        const { data } = response;
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        // 將 token 存放在 localStorage 內
        localStorage.setItem("token", data.token);
        // 將資料傳到 store 中
        setCurrentUser(data.user);
        // 成功登入後轉址到餐聽首頁
        router.push("/restaurants");
      } catch (error) {
        password.value = "";
        isProcessing.value = false;
        Toast.fire({
          icon: "warning",
          title: "請確認您輸入了正確的帳號密碼",
        });
      }
    }
    return {
      email,
      password,
      isProcessing,
      handleSubmit,
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.register === "success") {
      Toast.fire({
        icon: "success",
        title: "註冊成功，請輸入帳號密碼登入",
      });
    }
    next();
  },
};
</script>
