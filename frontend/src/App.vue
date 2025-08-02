<template>
  <div>
    <AppHeader :user="user" :isLoggedIn="isLoggedIn" @logout="handleLogout" />

    <router-view />

    <LoginModal @login-success="handleLoginSuccess" />
    <RegisterModal />
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import LoginModal from "./modals/LoginModal.vue";
import RegisterModal from "./modals/RegisterModal.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    LoginModal,
    RegisterModal,
  },
  data() {
    return {
      user: null,
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
