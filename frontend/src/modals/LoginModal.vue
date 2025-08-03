<template>
  <div
    class="modal fade"
    id="loginModal"
    tabindex="-1"
    aria-labelledby="loginModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">Đăng nhập</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Đóng"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="userCode" class="form-label">Mã đăng nhập</label>
              <input
                type="text"
                class="form-control"
                id="userCode"
                v-model="userCode"
                placeholder="VD: DG001 hoặc NV123"
                required
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="password"
                required
              />
            </div>

            <div v-if="error" class="text-danger small mb-2">{{ error }}</div>

            <button type="submit" class="btn btn-success w-100">
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
  name: "LoginModal",
  data() {
    return {
      userCode: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async handleLogin() {
      this.error = "";
      try {
        const res = await fetch("http://localhost:3000/api/auth/login/reader", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            maSo: this.userCode,
            password: this.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.role);

        this.$emit("login-success", data.user);

        const modalEl = document.getElementById("loginModal");
        const modal = Modal.getInstance(modalEl);
        modal.hide();

        // 👉 Phân trang theo role
        window.location.href = data.redirect;
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
.modal-body {
  background-color: #fffefc;
}
</style>
