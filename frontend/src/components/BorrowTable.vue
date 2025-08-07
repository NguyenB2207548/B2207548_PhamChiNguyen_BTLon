<template>
  <div>
    <h4>Quản lý mượn sách</h4>
    <table class="table table-bordered mt-3">
      <thead class="table-dark">
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
                : item.trangThai === "returned"
                ? "Đã trả"
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

            <template v-else-if="item.trangThai === 'approved' && !item.daTra">
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

  <!-- Modal trả sách -->
  <div
    class="modal fade"
    id="returnModal"
    tabindex="-1"
    aria-labelledby="returnModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="returnModalLabel">Xác nhận trả sách</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" v-if="selectedBorrow">
          <p><strong>Độc giả:</strong> {{ selectedBorrow.tenDocGia }}</p>
          <p><strong>Sách:</strong> {{ selectedBorrow.tenSach }}</p>
          <p>
            <strong>Ngày mượn:</strong>
            {{ formatDate(selectedBorrow.ngayMuon) }}
          </p>
          <p>
            <strong>Ngày hẹn trả:</strong>
            {{ formatDate(selectedBorrow.ngayTra) }}
          </p>
          <p v-if="returnInfo">
            <strong>Ngày trả:</strong> {{ formatDate(returnInfo.ngayTra)
            }}<br />
            <strong>Trễ:</strong> {{ returnInfo.soNgayTre }} ngày<br />
            <strong>Tiền phạt:</strong>
            {{ returnInfo.tienPhat.toLocaleString() }} VND
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Hủy
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmReturnBook"
          >
            Xác nhận trả sách
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
  data() {
    return {
      borrowRequests: [],
      selectedBorrow: null,
      returnInfo: null,
      returnModal: null,
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
    async fetchBorrows() {
      const res = await fetch("http://localhost:3000/api/borrows/getAll");
      this.borrowRequests = await res.json();
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

    async returnBook(id) {
      const borrow = this.borrowRequests.find((b) => b._id === id);
      this.selectedBorrow = borrow;

      const res = await fetch("http://localhost:3000/api/returns/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          maSach: borrow.maSach._id,
          maDG: borrow.maDocGia._id,
        }),
      });

      if (res.ok) {
        this.returnInfo = await res.json();
        this.returnModal.show();
      } else {
        alert("Không thể xem thông tin trả sách!");
      }
    },

    async confirmReturnBook() {
      const res = await fetch("http://localhost:3000/api/returns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          maSach: this.selectedBorrow.maSach._id,
          maDG: this.selectedBorrow.maDocGia._id,
        }),
      });

      if (res.ok) {
        alert("Trả sách thành công!");
        this.returnModal.hide();
        this.fetchBorrows();
      } else {
        alert("Lỗi khi trả sách!");
      }
    },
  },
  mounted() {
    this.fetchBorrows();
    this.returnModal = new Modal(document.getElementById("returnModal"));
  },
};
</script>
