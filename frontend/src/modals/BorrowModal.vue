<template>
  <div
    class="modal fade"
    id="borrowModal"
    tabindex="-1"
    aria-labelledby="borrowModalLabel"
    aria-hidden="true"
    ref="borrowModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="submitForm">
          <div class="modal-header">
            <h5 class="modal-title" id="borrowModalLabel">Đăng ký mượn sách</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Đóng"
              @click="onCloseClicked"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Ngày mượn</label>
              <input
                type="date"
                class="form-control"
                v-model="ngayMuon"
                required
                :min="today"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Ngày hẹn trả</label>
              <input
                type="date"
                class="form-control"
                v-model="ngayHenTra"
                required
                :min="ngayMuon"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="onCloseClicked"
            >
              Hủy
            </button>
            <button type="submit" class="btn btn-primary">Xác nhận</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from "bootstrap";

export default {
  name: "ModalBorrowBook",
  props: ["maSach"],
  data() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      today,
      ngayMuon: today,
      ngayHenTra: today,
      modalInstance: null,
    };
  },
  mounted() {
    this.initModal();
  },
  beforeUnmount() {
    // Hủy modal instance khi component bị hủy
    this.cleanupModal();
  },
  methods: {
    initModal() {
      const modalEl = this.$refs.borrowModal;
      if (modalEl) {
        this.modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
      } else {
        console.error("Modal element not found!");
      }
    },
    showModal() {
      if (!this.modalInstance) {
        this.initModal();
      }
      if (this.modalInstance) {
        this.modalInstance.show();
      }
    },
    resetForm() {
      const today = new Date().toISOString().slice(0, 10);
      this.ngayMuon = today;
      this.ngayHenTra = today;
    },
    async submitForm() {
      if (new Date(this.ngayHenTra) < new Date(this.ngayMuon)) {
        alert("Ngày trả phải lớn hơn hoặc bằng ngày mượn");
        return;
      }

      const borrowData = {
        maSach: this.maSach,
        ngayMuon: this.ngayMuon,
        ngayTra: this.ngayHenTra,
      };

      try {
        const res = await fetch("http://localhost:3000/api/borrows", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(borrowData),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Đăng ký mượn thất bại");
        }

        alert("Đăng ký mượn thành công!");
        this.onCloseClicked();
        this.$emit("borrowed");
      } catch (err) {
        alert(err.message);
      }
    },
    cleanupModal() {
      if (this.modalInstance) {
        this.modalInstance.hide();
        this.modalInstance.dispose();
        this.modalInstance = null;
      }
      // Xóa lớp modal-open và khôi phục overflow
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      // Xóa tất cả backdrop
      document
        .querySelectorAll(".modal-backdrop")
        .forEach((backdrop) => backdrop.remove());
    },
    onCloseClicked() {
      if (document.activeElement) document.activeElement.blur();

      if (this.modalInstance) {
        const modalEl = this.$refs.borrowModal;
        modalEl.addEventListener(
          "hidden.bs.modal",
          () => {
            this.resetForm();
            this.$emit("modal-closed");
            // Xóa lớp modal-open và khôi phục overflow
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
            // Xóa backdrop
            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) backdrop.remove();
          },
          { once: true }
        );
        this.modalInstance.hide();
      }
    },
  },
};
</script>
