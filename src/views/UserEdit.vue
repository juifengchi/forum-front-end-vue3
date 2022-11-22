<template>
  <div class="container py-5">
    <form @submit.stop.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          v-model="profile.name"
          id="name"
          type="text"
          name="name"
          class="form-control"
          placeholder="Enter Name"
          required
        />
      </div>

      <div class="form-group">
        <label for="image">Image</label>
        <img
          v-if="profile.image"
          :src="profile.image"
          class="d-block img-thumbnail mb-3"
          width="200"
          height="200"
        />
        <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          class="form-control-file"
          @change="handleFileChange"
        />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="isProcessing">
        {{ isProcessing ? "Processing..." : "Submit" }}
      </button>
    </form>
  </div>
</template>

<script>
import userAPI from "./../apis/users";
import { mapState } from "vuex";
import { Toast } from "./../utils/helpers";

export default {
  name: "UserEdit",
  data() {
    return {
      profile: {
        id: -1,
        name: "",
        image: "",
      },
      isProcessing: false,
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  watch: {
    currentUser() {
      this.setUser();
    },
  },
  setup() {
    const { id: userId } = this.$route.params;
    if (userId !== this.currentUser.id) {
      this.$router.push({ name: "not-found" });
      return;
    }
    this.setUser();
  },
  beforeRouteUpdate(to, from, next) {
    const { id: userId } = to.params;
    if (userId !== this.currentUser.id) {
      this.$router.push({ name: "not-found" });
      return;
    }
    this.setUser();
    next();
  },
  methods: {
    setUser() {
      this.profile = {
        ...this.profile,
        id: this.currentUser.id,
        name: this.currentUser.name,
        image: this.currentUser.image,
      };
    },
    handleFileChange(e) {
      const { files } = e.target;
      if (files.length === 0) {
        this.profile.image = "";
      } else {
        const imageURL = window.URL.createObjectURL(files[0]);
        this.profile.image = imageURL;
      }
    },
    async handleSubmit(e) {
      if (!this.profile.name) {
        Toast.fire({
          type: "warning",
          title: "請填寫姓名",
        });
        return;
      }
      const form = e.target;
      const formData = new FormData(form);

      try {
        this.isProcessing = true;
        const { data } = await userAPI.update({
          userId: this.profile.id,
          formData,
        });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.$store.dispatch("fetchCurrentUser");
        this.$router.push({ name: "user", params: { id: this.profile.id } });
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法更新個人資料，請稍後再試",
        });
      }
    },
  },
};
</script>
