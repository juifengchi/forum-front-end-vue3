<template>
  <div class="album py-5 bg-light">
    <Spinner v-if="isLoading" />
    <div v-else class="container">
      <div class="card mb-3">
        <!-- UserProfileCard -->
        <UserProfileCard
          :profile="profile"
          :current-user="currentUser"
          :is-followed="isFollowed"
          @after-add-following="afterAddFollowing"
          @after-delete-following="afterDeleteFollowing"
        />
      </div>

      <div class="row">
        <div class="col-md-4">
          <!-- UserFollowingsCard -->
          <UserFollowingsCard :followings="followings" />
          <br />
          <!-- UserFollowersCard -->
          <UserFollowersCard :followers="followers" />
        </div>
        <div class="col-md-8">
          <!-- UserCommentsCard -->
          <UserCommentsCard :comments="comments" />
          <br />
          <!-- UserFavoritedRestaurantsCard -->
          <UserFavoritedRestaurantsCard
            :favorited-restaurants="favoritedRestaurants"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserProfileCard from "./../components/UserProfileCard.vue";
import UserFollowingsCard from "./../components/UserFollowingsCard.vue";
import UserFollowersCard from "./../components/UserFollowersCard.vue";
import UserCommentsCard from "./../components/UserCommentsCard.vue";
import UserFavoritedRestaurantsCard from "./../components/UserFavoritedRestaurantsCard.vue";
import userAPI from "./../apis/users";
import Spinner from "./../components/Spinner.vue";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";

export default {
  name: "User",
  components: {
    UserProfileCard,
    UserFollowingsCard,
    UserFollowersCard,
    UserCommentsCard,
    UserFavoritedRestaurantsCard,
    Spinner,
  },
  data() {
    return {
      profile: {
        id: -1,
        name: "",
        email: "",
        image: "",
        commentsLength: 0,
        favoritedRestaurantsLength: 0,
        followersLength: 0,
        follwingsLength: 0,
      },
      isFollowed: false,
      followings: [],
      followers: [],
      comments: [],
      favoritedRestaurants: [],
      isLoading: true,
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  setup() {
    const { id: userId } = this.$route.params;
    this.fetchUser(userId);
  },
  beforeRouteUpdate(to, from, next) {
    const { id: userId } = to.params;
    this.fetchUser(userId);
    next();
  },
  methods: {
    async fetchUser(userId) {
      try {
        this.isLoading = true;
        const { data } = await userAPI.get({ userId });
        this.profile = {
          id: data.profile.id,
          name: data.profile.name,
          email: data.profile.email,
          image: data.profile.image,
          commentsLength: data.profile.Comments.length,
          favoritedRestaurantsLength: data.profile.FavoritedRestaurants.length,
          followersLength: data.profile.Followers.length,
          follwingsLength: data.profile.Followings.length,
        };
        this.isFollowed = data.isFollowed;
        this.followings = data.profile.Followings;
        this.followers = data.profile.Followers;
        this.favoritedRestaurants = data.profile.FavoritedRestaurants;
        this.comments = data.profile.Comments.filter(
          (comment) => comment.Restaurant
        );
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法取得使用者資料，請稍後再試",
        });
      }
    },
    afterAddFollowing() {
      this.isFollowed = true;
      this.profile.followersLength += 1;
      this.followers.push({
        id: this.currentUser.id,
        image: this.currentUser.image,
      });
    },
    afterDeleteFollowing() {
      this.isFollowed = false;
      this.profile.followersLength -= 1;
      this.followers = this.followers.filter(
        (follower) => follower.id !== this.currentUser.id
      );
    },
  },
};
</script>
