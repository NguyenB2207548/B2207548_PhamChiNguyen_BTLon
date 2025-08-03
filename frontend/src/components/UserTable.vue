<template>
  <div>
    <h4>Quản lý tài khoản</h4>
    <button class="btn btn-primary mb-2 mt-2" @click="showModal = true">
      + Đăng ký nhân viên
    </button>

    <table class="table table-bordered mt-3">
      <thead>
        <tr>
          <th>Mã</th>
          <th>Họ tên</th>
          <th>SĐT</th>
          <th>Vai trò</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.maNV || user.maDG">
          <td>{{ user.maNV || user.maDG }}</td>
          <td>
            <span v-if="user.role === 'reader'"
              >{{ user.hoLot }} {{ user.ten }}</span
            >
            <span v-else>{{ user.hoTenNV }}</span>
          </td>

          <td>{{ user.dienThoai || user.soDienThoai }}</td>
          <td>{{ user.role === "reader" ? "Độc giả" : "Nhân viên" }}</td>
          <td>
            <button
              class="btn btn-danger btn-sm"
              @click="deleteUser(user.maNV || user.maDG)"
            >
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODAL ĐANG KY -->
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Đăng ký tài khoản nhân viên</h5>
            <button
              type="button"
              class="btn-close"
              @click="
                showModal = false;
                resetForm();
              "
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="registerStaff">
              <div class="mb-2">
                <label>Mã nhân viên</label>
                <input
                  type="text"
                  v-model="newStaff.maNV"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-2">
                <label>Họ tên</label>
                <input
                  type="text"
                  v-model="newStaff.hoTenNV"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-2">
                <label>Mật khẩu</label>
                <input
                  type="password"
                  v-model="newStaff.password"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-2">
                <label>Chức vụ</label>
                <input
                  type="text"
                  v-model="newStaff.chucVu"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-2">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  v-model="newStaff.diaChi"
                  class="form-control"
                  required
                />
              </div>
              <div class="mb-2">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  v-model="newStaff.soDienThoai"
                  class="form-control"
                  required
                />
              </div>
              <button type="submit" class="btn btn-success">Đăng ký</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      showModal: false,
      newStaff: {
        maNV: "",
        hoTenNV: "",
        password: "",
        chucVu: "",
        diaChi: "",
        soDienThoai: "",
      },
    };
  },
  methods: {
    async fetchUsers() {
      this.users = await (
        await fetch("http://localhost:3000/api/users/getAll")
      ).json();
    },
    async deleteUser(id) {
      if (confirm("Xóa người dùng này?")) {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/api/users/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.fetchUsers();
      }
    },
    async registerStaff() {
      try {
        const res = await fetch(
          "http://localhost:3000/api/auth/register/staff",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(this.newStaff),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          alert(err.message || "Đăng ký thất bại");
          return;
        }

        alert("Đăng ký thành công!");
        this.showModal = false;
        this.fetchUsers();

        // Reset form
        this.newStaff = {
          maNV: "",
          hoTenNV: "",
          password: "",
          chucVu: "",
          diaChi: "",
          soDienThoai: "",
        };
      } catch (err) {
        console.error("Lỗi đăng ký:", err);
        alert("Có lỗi xảy ra khi đăng ký.");
      }
    },
    resetForm() {
      this.newStaff = {
        maNV: "",
        hoTenNV: "",
        password: "",
        chucVu: "",
        diaChi: "",
        soDienThoai: "",
      };
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>
