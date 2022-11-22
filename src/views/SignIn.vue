<template>
  <div class="container py-5">
    <form class="w-100" @submit.prevent.stop="handleSubmit">
      <div class="text-center mb-4">
        <h1 class="h3 mb-3 font-weight-normal">
          Sign In
        </h1>
      </div>

      <div class="form-label-group mb-2">
        <label for="email">email</label>
        <input id="email" v-model="email" name="email" type="email" class="form-control" placeholder="email" autocomplete="username" required autofocus />
      </div>

      <div class="form-label-group mb-3">
        <label for="password">Password</label>
        <input id="password" v-model="password" name="password" type="password" class="form-control" placeholder="Password" autocomplete="current-password" required />
      </div>

      <button class="btn btn-lg btn-primary btn-block mb-3" type="submit" :disabled="isProcessing">
        {{ isProcessing ? 'Processing...' : 'Submit' }}
      </button>

      <div class="text-center mb-3">
        <p>
          <router-link to="/signup">
            Sign Up
          </router-link>
        </p>
      </div>

      <p class="mt-5 mb-3 text-muted text-center">
        &copy; 2017-2018
      </p>
    </form>
  </div>
</template>

<script>
import authorizationAPI from './../apis/authorization'
import { Toast } from './../utils/helpers'

export default {
  name: 'SignIn',
  data() {
    return {
      email: '',
      password: '',
      isProcessing: false,
    }
  },
  beforeRouteEnter(to, from, next) {
    const { register } = to.params
    if (register === 'success') {
      Toast.fire({
        icon: 'success',
        title: '註冊成功，請輸入帳號密碼登入',
      })
    }
    next()
  },
  methods: {
    async handleSubmit(e) {
      try {
        if (!this.email || !this.password) {
          Toast.fire({
            icon: 'warning',
            title: '請填入 email 和 password',
          })
          return
        }

        this.isProcessing = true

        // 使用 authorizationAPI 的 signIn 方法
        // 並且帶入使用者填寫的 email 和 password
        const response = await authorizationAPI.signIn({
          email: this.email,
          password: this.password,
        })

        const { data } = response

        if (data.status !== 'success') {
          throw new Error(data.message)
        }

        // 將 token 存放在 localStorage 內
        localStorage.setItem('token', data.token)

        // 將資料傳到 Vuex 中
        this.$store.commit('setCurrentUser', data.user)

        // 成功登入後轉址到餐聽首頁
        this.$router.push('/restaurants')
      } catch (error) {
        this.password = ''
        this.isProcessing = false

        Toast.fire({
          icon: 'warning',
          title: '請確認您輸入了正確的帳號密碼',
        })
      }
    },
  },
}
</script>
