<template>
  <div class="card">
    <div class="card-header">
      最新評論
    </div>
    <div class="card-body">
      <div v-for="comment in comments" :key="comment.id">
        <h4>
          <router-link :to="{ name: 'restaurant', params: { id: comment.Restaurant.id } }">
            {{ comment.Restaurant.name }}
          </router-link>
        </h4>
        <p>{{ comment.text }}</p>
        by
        <router-link :to="{ name: 'user', params: { id: comment.User.id } }">
          {{ comment.User.name }}
        </router-link>
        <!-- TODO: filter fromNow -->
        at {{ comment.createdAt }}
        <hr />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewestComments',
  props: {
    comments: {
      type: Array,
      required: true,
    },
  },
}
</script>
