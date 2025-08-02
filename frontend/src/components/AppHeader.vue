<template>
  <nav class="navbar navbar-expand-lg navbar-light nav-header">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="#">Library ctu</a>

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
            <a class="nav-link" href="#">Trang chủ</a>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="communityDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Thể loại
            </a>
            <ul class="dropdown-menu" aria-labelledby="communityDropdown">
              <li><a class="dropdown-item" href="#">Groups</a></li>
              <li><a class="dropdown-item" href="#">Discussions</a></li>
            </ul>
          </li>
        </ul>

        <!-- Tìm kiếm -->
        <form
          class="d-flex mx-auto justify-content-center flex-grow-1 mx-3"
          role="search"
        >
          <div class="position-relative w-100" style="max-width: 650px">
            <input
              type="text"
              class="form-control ps-3 pe-5 rounded border"
              placeholder="Search books"
            />
            <i
              class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
              style="pointer-events: none"
            ></i>
          </div>
        </form>

        <!-- Đăng nhập và đăng ký -->
        <div class="d-flex align-items-center">
          <!-- Nếu đã đăng nhập -->
          <template v-if="isLoggedIn">
            <span class="me-3">
              Xin chào, <strong>{{ user.ten }}</strong>
            </span>
            <button
              class="btn btn-outline-secondary btn-sm"
              @click="handleLogout"
            >
              Đăng xuất
            </button>
          </template>

          <!-- Nếu chưa đăng nhập -->
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
    user: {
      type: Object,
      default: null,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleLogout() {
      this.$emit("logout"); // gửi sự kiện ra ngoài để App.vue xử lý
    },
  },
};
</script>

<style>
.nav-header {
  background-color: #faf8f6;
  /* max-width: 1280px; */
  margin: 0 auto;
}
</style>
