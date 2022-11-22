<template>
  <div class="container py-5">
    <form class="w-100" @submit.prevent.stop="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">Sign Up</h1>
      </div>

      <div class="form-label-group mb-2">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="name"
          name="name"
          type="text"
          class="form-control"
          placeholder="name"
          autocomplete="username"
          required
          autofocus
        />
      </div>

      <div class="form-label-group mb-2">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          name="email"
          type="email"
          class="form-control"
          placeholder="email"
          autocomplete="email"
          required
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
          autocomplete="new-password"
          required
        />
      </div>

      <div class="form-label-group mb-3">
        <label for="password-check">Password Check</label>
        <input
          id="password-check"
          v-model="passwordCheck"
          name="passwordCheck"
          type="password"
          class="form-control"
          placeholder="Password"
          autocomplete="new-password"
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
          <router-link to="/signin"> Sign In </router-link>
        </p>
      </div>

      <p class="mt-5 mb-3 text-muted text-center">&copy; 2017-2018</p>
    </form>
  </div>
</template>

<script setup>
import authorizationAPI from "./../apis/authorization";
import { ref } from "vue";
import { Toast } from "./../utils/helpers";
import { useRouter } from "vue-router";
const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const passwordCheck = ref("");
const isProcessing = ref(false);

async function handleSubmit(e) {
  try {
    if (!name.value) {
      Toast.fire({
        icon: "warning",
        title: "請輸入名稱",
      });
      return;
    } else if (!email.value) {
      Toast.fire({
        icon: "warning",
        title: "請輸入信箱",
      });
      return;
    } else if (!password.value) {
      Toast.fire({
        icon: "warning",
        title: "請輸入密碼",
      });
      return;
    } else if (!passwordCheck.value) {
      Toast.fire({
        icon: "warning",
        title: "請輸入密碼確認",
      });
      return;
    } else if (password.value !== passwordCheck.value) {
      Toast.fire({
        icon: "warning",
        title: "密碼前後不一致",
      });
      return;
    }
    isProcessing.value = true;

    const formData = {
      name: name.value,
      email: email.value,
      password: password.value,
      passwordCheck: passwordCheck.value,
    };
    const { data } = await authorizationAPI.signUp(formData);
    if (data.status !== "success") {
      throw new Error(data.message);
    }

    router.push({ name: "sign-in", params: { register: "success" } });
  } catch (error) {
    isProcessing.value = false;
    Toast.fire({
      icon: "warning",
      title: "無法註冊，請稍候再試",
    });
  }
}
</script>
