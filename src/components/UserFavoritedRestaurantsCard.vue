<template>
  <div class="card">
    <div class="card-header"><strong>{{ favoritedRestaurants.length }}</strong> 收藏的餐廳</div>
    <div class="card-body">
      <router-link v-for="restaurant in favoritedRestaurants" :key="restaurant.id" :to="{ name: 'restaurant', params: { id: restaurant.id } }">
        <!-- TODO: filter emptyImage -->
        <img :src="restaurant.image" width="60" height="60" class="avatar" />
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserFavoritedRestaurantsCard',
  props: {
    favoritedRestaurants: {
      type: Array,
      required: true
    }
  }
}
</script>