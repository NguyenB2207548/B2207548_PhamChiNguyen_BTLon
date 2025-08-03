<template>
  <div>
    <div class="app1">
      <AppHeader
        :user="user"
        :isLoggedIn="isLoggedIn"
        :role="role"
        @logout="handleLogout"
      />
      <router-view />
    </div>
    <AppFooter />

    <LoginModal @login-success="handleLoginSuccess" />
    <RegisterModal />
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import LoginModal from "./modals/LoginModal.vue";
import RegisterModal from "./modals/RegisterModal.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    AppFooter,
    LoginModal,
    RegisterModal,
  },
  data() {
    return {
      user: null,
      role: localStorage.getItem("role"),
    };
  },
  computed: {
    isLoggedIn() {
      return this.user !== null;
    },
  },
  created() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },
  methods: {
    handleLoginSuccess(user) {
      this.user = user;
      localStorage.setItem("user", JSON.stringify(user));
    },
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.user = null;
    },
  },
};
</script>

<style>
.app1 {
  min-height: 100vh;
}
</style>
