<template>
  <div
    class="modal fade"
    id="registerModal"
    tabindex="-1"
    aria-labelledby="registerModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="registerModalLabel">Đăng ký tài khoản</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Đóng"
          ></button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label">Mã độc giả</label>
              <input
                v-model="form.maDG"
                type="text"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Mật khẩu</label>
              <input
                v-model="form.password"
                type="password"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Họ lót</label>
              <input
                v-model="form.hoLot"
                type="text"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Tên</label>
              <input
                v-model="form.ten"
                type="text"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Ngày sinh</label>
              <input
                v-model="form.ngaySinh"
                type="date"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Phái</label>
              <select v-model="form.phai" class="form-select" required>
                <option value="">-- Chọn phái --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Điện thoại</label>
              <input
                v-model="form.dienThoai"
                type="tel"
                class="form-control"
                required
              />
            </div>

            <div v-if="error" class="text-danger small mb-2">{{ error }}</div>
            <div v-if="success" class="text-success small mb-2">
              {{ success }}
            </div>

            <button type="submit" class="btn btn-success w-100">Đăng ký</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterModal",
  data() {
    return {
      form: {
        maDG: "",
        password: "",
        hoLot: "",
        ten: "",
        ngaySinh: "",
        phai: "",
        dienThoai: "",
      },
      error: "",
      success: "",
    };
  },
  methods: {
    async handleRegister() {
      this.error = "";
      this.success = "";
      try {
        const res = await fetch(
          "http://localhost:3000/api/auth/register/reader",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.form),
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");

        this.success = "Đăng ký thành công! Bạn có thể đăng nhập.";

        // Tự động ẩn modal sau đăng ký
        const registerModalEl = document.getElementById("registerModal");
        const registerModal =
          window.bootstrap.Modal.getInstance(registerModalEl);
        if (registerModal) registerModal.hide();

        // Hiển thị modal đăng nhập
        const loginModalEl = document.getElementById("loginModal");
        if (loginModalEl) {
          const loginModal = new window.bootstrap.Modal(loginModalEl);
          loginModal.show();
        }
      } catch (err) {
        this.error = err.message;
      }
    },
    resetForm() {
      this.form = {
        maDG: "",
        password: "",
        hoLot: "",
        ten: "",
        ngaySinh: "",
        phai: "",
        dienThoai: "",
      };
      this.error = "";
      this.success = "";
    },
  },
  mounted() {
    const modalEl = document.getElementById("registerModal");
    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", () => {
        this.resetForm();
      });
    }
  },
};
</script>
