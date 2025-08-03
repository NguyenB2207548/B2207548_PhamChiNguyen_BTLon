<template>
  <div>
    <h4>Yêu cầu mượn sách</h4>
    <table class="table table-bordered mt-3">
      <thead>
        <tr>
          <th>Độc giả</th>
          <th>Sách</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in borrowRequests" :key="item._id">
          <td>{{ item.tenDocGia }}</td>
          <td>{{ item.tenSach }}</td>
          <td>{{ formatDate(item.ngayMuon) }}</td>
          <td>{{ formatDate(item.ngayTra) }}</td>
          <td>
            {{
              item.trangThai === "approved"
                ? "Đã duyệt"
                : item.trangThai === "rejected"
                ? "Đã từ chối"
                : item.trangThai === "pending"
                ? "Đang chờ duyệt"
                : item.trangThai
            }}
          </td>

          <td>
            <template v-if="item.trangThai === 'pending'">
              <button
                class="btn btn-success btn-sm me-1"
                @click="approveBorrow(item._id)"
              >
                <i class="bi bi-check-circle me-1"></i> Duyệt
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="rejectBorrow(item._id)"
              >
                <i class="bi bi-x-circle me-1"></i> Từ chối
              </button>
            </template>

            <template v-else-if="item.trangThai === 'approved'">
              <button
                class="btn btn-primary btn-sm"
                @click="returnBook(item._id)"
              >
                <i class="bi bi-box-arrow-in-left me-1"></i> Trả sách
              </button>
            </template>

            <template v-else>
              <span class="text-muted fst-italic">Không khả dụng</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      borrowRequests: [],
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
    async fetchBorrows() {
      this.borrowRequests = await (
        await fetch("http://localhost:3000/api/borrows/getAll")
      ).json();
    },
    async approveBorrow(id) {
      await fetch(`http://localhost:3000/api/borrows/approve/${id}`, {
        method: "PUT",
      });
      this.fetchBorrows();
    },
    async rejectBorrow(id) {
      await fetch(`http://localhost:3000/api/borrows/reject/${id}`, {
        method: "PUT",
      });
      this.fetchBorrows();
    },
  },
  mounted() {
    this.fetchBorrows();
  },
};
</script>
