<template>
  <div
    class="modal fade"
    id="borrowModal"
    tabindex="-1"
    aria-labelledby="borrowModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="submitForm">
          <div class="modal-header">
            <h5 class="modal-title" id="borrowModalLabel">Đăng ký mượn sách</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Đóng"
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
              data-bs-dismiss="modal"
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
export default {
  name: "ModalBorrowBook",
  props: ["maSach"],
  data() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      today,
      ngayMuon: today,
      ngayHenTra: today,
    };
  },
  methods: {
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

        // Đóng modal đúng cách
        const modalEl = document.getElementById("borrowModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.hide();

        // Cleanup backdrop nếu còn sót
        setTimeout(() => {
          document.body.classList.remove("modal-open");
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop) backdrop.remove();
        }, 300);
      } catch (err) {
        alert(err.message);
      }
    },
  },
};
</script>
