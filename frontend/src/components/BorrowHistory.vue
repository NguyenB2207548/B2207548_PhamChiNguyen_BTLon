<template>
  <div class="container py-5">
    <h3 class="mb-4">📖 Lịch sử mượn sách</h3>

    <div v-if="borrows.length > 0" class="table-responsive">
      <table
        class="table table-bordered table-striped align-middle text-center"
      >
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Tên sách</th>
            <th>Ngày mượn</th>
            <th>Ngày hẹn trả</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Số ngày trễ</th>
            <th>Tiền phạt</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in borrows" :key="item._id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.tenSach }}</td>
            <td>{{ formatDate(item.ngayMuon) }}</td>
            <td>{{ formatDate(item.ngayHenTra || item.ngayTra) }}</td>
            <td>
              <span v-if="item.daTra || item.ngayTra">{{
                formatDate(item.ngayTra)
              }}</span>
              <span v-else class="text-muted fst-italic">Chưa trả</span>
            </td>
            <td>
              <span
                :class="{
                  'badge bg-secondary': item.trangThai === 'pending',
                  'badge bg-success':
                    item.trangThai === 'approved' &&
                    (item.daTra || item.ngayTra),
                  'badge bg-danger': item.trangThai === 'rejected',
                  'badge bg-primary': item.trangThai === 'returned',
                }"
              >
                {{
                  item.trangThai === "pending"
                    ? "Chờ duyệt"
                    : item.trangThai === "rejected"
                    ? "Từ chối"
                    : item.trangThai === "returned"
                    ? "Đã hoàn tất"
                    : item.trangThai === "approved"
                    ? item.daTra || item.ngayTra
                      ? "Đã trả"
                      : "Đang mượn"
                    : "Không xác định"
                }}
              </span>
            </td>
            <td>{{ item.soNgayTre || 0 }}</td>
            <td>
              <span v-if="item.tienPhat">
                {{ item.tienPhat.toLocaleString("vi-VN") }} đ
              </span>
              <span v-else>0 đ</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="alert alert-info text-center">
      Bạn chưa có lịch sử mượn sách nào.
    </div>
  </div>
</template>

<script>
export default {
  name: "BorrowHistory",
  data() {
    return {
      borrows: [],
    };
  },
  methods: {
    async fetchBorrowHistory() {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/borrows/getHistory", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        alert("Không thể tải dữ liệu lịch sử mượn.");
        return;
      }

      const data = await res.json();
      this.borrows = data;
    },
    formatDate(dateStr) {
      if (!dateStr) return null;
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN");
    },
  },
  mounted() {
    this.fetchBorrowHistory();
  },
};
</script>

<style scoped>
.badge {
  font-size: 0.85rem;
  padding: 0.4em 0.7em;
}
</style>
