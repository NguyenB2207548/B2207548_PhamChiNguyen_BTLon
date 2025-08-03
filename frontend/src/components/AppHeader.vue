<template>
  <nav class="navbar navbar-expand-lg navbar-light nav-header">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/">Library ctu</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-3 mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Trang chủ</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products">Sản phẩm</router-link>
          </li>
        </ul>

        <!-- Ô tìm kiếm -->
        <form
          class="d-flex mx-auto justify-content-center flex-grow-1 mx-3"
          role="search"
          @submit.prevent="handleSearch"
        >
          <div class="position-relative w-100" style="max-width: 600px">
            <input
              type="text"
              v-model="searchQuery"
              class="form-control ps-3 pe-5 rounded border"
              placeholder="Tìm kiếm sách theo tên"
            />
            <button
              type="submit"
              class="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
            >
              <i class="bi bi-search text-muted fs-5"></i>
            </button>
          </div>
        </form>

        <!-- Tài khoản -->

        <div class="d-flex align-items-center ms-auto gap-2">
          <template v-if="isLoggedIn">
            <span class="fw-semibold text-dark">
              {{ role === "staff" ? user.hoTenNV || user.ten : user.ten }}
            </span>
            <router-link
              class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 ms-2"
              to="/borrow-history"
            >
              <i class="bi bi-journal-text"></i> Lịch sử
            </router-link>
            <button
              class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 ms-2"
              @click="handleLogout"
            >
              <i class="bi bi-box-arrow-right"></i> Thoát
            </button>
          </template>

          <template v-else>
            <a
              href="#"
              class="nav-link text-dark me-3"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
              >Đăng nhập</a
            >
            <a
              href="#"
              class="nav-link text-dark"
              data-bs-toggle="modal"
              data-bs-target="#registerModal"
              >Đăng ký</a
            >
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppHeader",
  props: {
    user: { type: Object, default: null },
    isLoggedIn: { type: Boolean, default: false },
    role: { type: String, default: "reader" },
  },
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    handleLogout() {
      this.$emit("logout");
    },
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: "/products",
          query: { search: this.searchQuery },
        });
      }
    },
  },
};
</script>

<style>
.nav-header {
  background-color: #faf8f6;
  margin: 0 auto;
}
</style>
