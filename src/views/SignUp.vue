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
          v-model="signUpInfo.name"
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
          v-model="signUpInfo.email"
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
          v-model="signUpInfo.password"
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
          v-model="signUpInfo.passwordCheck"
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
          <RouterLink to="/signin"> Sign In </RouterLink>
        </p>
      </div>
      <p class="mt-5 mb-3 text-muted text-center">&copy; 2017-2018</p>
    </form>
  </div>
</template>

<script setup>
import authorizationAPI from "./../apis/authorization";
import { ref, reactive } from "vue";
import { Toast } from "./../utils/helpers";
import { useRouter, RouterLink } from "vue-router";

const router = useRouter();
const signUpInfo = reactive({
  name: "",
  email: "",
  password: "",
  passwordCheck: "",
});
const isProcessing = ref(false);

async function handleSubmit() {
  try {
    if (!signUpInfo.name) {
      Toast.fire({
        icon: "warning",
        title: "???????????????",
      });
      return;
    } else if (!signUpInfo.email) {
      Toast.fire({
        icon: "warning",
        title: "???????????????",
      });
      return;
    } else if (!signUpInfo.password) {
      Toast.fire({
        icon: "warning",
        title: "???????????????",
      });
      return;
    } else if (!signUpInfo.passwordCheck) {
      Toast.fire({
        icon: "warning",
        title: "?????????????????????",
      });
      return;
    } else if (signUpInfo.password !== signUpInfo.passwordCheck) {
      Toast.fire({
        icon: "warning",
        title: "?????????????????????",
      });
      return;
    }
    isProcessing.value = true;

    const { data } = await authorizationAPI.signUp(signUpInfo);
    if (data.status !== "success") {
      throw new Error(data.message);
    }
    router.push({ name: "sign-in", params: { register: "success" } });
  } catch (error) {
    isProcessing.value = false;
    Toast.fire({
      icon: "warning",
      title: "??????????????????????????????",
    });
  }
}
</script>
