<template>
  <div class="row no-gutters">
    <div class="col-md-4">
      <!-- TODO: filter emptyImage -->
      <img :src="profile.image" width="300px" height="300px" />
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">{{ profile.name }}</h5>
        <p class="card-text">
          {{ profile.email }}
        </p>
        <ul class="list-unstyled list-inline">
          <li>
            <strong>{{ profile.commentsLength }}</strong> 已評論餐廳
          </li>
          <li>
            <strong>{{ profile.favoritedRestaurantsLength }}</strong> 收藏的餐廳
          </li>
          <li>
            <strong>{{ profile.follwingsLength }}</strong> followings (追蹤者)
          </li>
          <li>
            <strong>{{ profile.followersLength }}</strong> followers (追隨者)
          </li>
        </ul>
        <p>
          <router-link v-if="profile.id === currentUser.id" :to="{ name: 'user-edit', params: { id: profile.id } }">
            <button type="submit" class="btn btn-primary">Edit</button>
          </router-link>
          <span v-else>
            <button v-if="isFollowed" type="submit" class="btn btn-primary" @click.stop.prevent="deleteFollowing(profile.id)">取消追蹤</button>
            <button v-else type="submit" class="btn btn-primary" @click.stop.prevent="addFollowing(profile.id)">追蹤</button>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import userAPI from './../apis/users'
import { Toast } from './../utils/helpers'

export default {
  name: 'UserProfileCard',
  props: {
    profile: {
      type: Object,
      required: true,
    },
    currentUser: {
      type: Object,
      required: true,
    },
    isFollowed: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    async addFollowing(userId) {
      try {
        const { data } = await userAPI.addFollowing({ userId })
        if (data.status !== 'success') {
          throw new Error(data.message)
        }
        this.$emit('after-add-following')
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: '無法加入追蹤，請稍後再試',
        })
      }
    },
    async deleteFollowing(userId) {
      try {
        const { data } = await userAPI.deleteFollowing({ userId })
        if (data.status !== 'success') {
          throw new Error(data.message)
        }
        this.$emit('after-delete-following')
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: '無法取消追蹤，請稍後再試',
        })
      }
    },
  },
}
</script>
