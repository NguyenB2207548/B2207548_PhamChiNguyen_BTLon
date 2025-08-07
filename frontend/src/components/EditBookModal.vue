<template>
  <div
    class="modal fade"
    id="editBookModal"
    tabindex="-1"
    aria-labelledby="editBookModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editBookModalLabel">Chỉnh sửa sách</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="onCloseClicked"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label class="form-label">Tên sách</label>
              <input
                type="text"
                v-model="book.tenSach"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Thể loại</label>
              <input
                type="text"
                v-model="book.theLoai"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Tác giả</label>
              <input
                type="text"
                v-model="book.tacGia"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Số quyển</label>
              <input
                type="number"
                v-model.number="book.soQuyen"
                class="form-control"
                required
                min="1"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Năm xuất bản</label>
              <input
                type="number"
                v-model.number="book.namXuatBan"
                class="form-control"
                required
                min="0"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Nguồn gốc</label>
              <input type="text" v-model="book.nguonGoc" class="form-control" />
            </div>

            <button type="submit" class="btn btn-primary">Cập nhật</button>
            <button
              type="button"
              class="btn btn-secondary ms-2"
              @click="onCloseClicked"
            >
              Hủy
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedBook: Object,
  },
  data() {
    return {
      book: {
        maSach: "",
        tenSach: "",
        theLoai: "",
        tacGia: "",
        soQuyen: 1,
        namXuatBan: null,
        nguonGoc: "",
      },
    };
  },
  watch: {
    selectedBook: {
      immediate: true,
      handler(newBook) {
        if (newBook && newBook.maSach) {
          this.book = { ...newBook };
          this.$nextTick(() => {
            this.showModal();
          });
        }
      },
    },
  },
  methods: {
    showModal() {
      const modal = bootstrap.Modal.getOrCreateInstance(this.$refs.modal);
      modal.show();
    },
    hideModal() {
      const modal = bootstrap.Modal.getInstance(this.$refs.modal);
      modal?.hide();
    },
    onCloseClicked() {
      if (document.activeElement) document.activeElement.blur();
      this.hideModal();
      this.resetForm();
      this.$emit("modal-closed");
    },
    resetForm() {
      this.book = {
        maSach: "",
        tenSach: "",
        theLoai: "",
        tacGia: "",
        soQuyen: 1,
        namXuatBan: null,
        nguonGoc: "",
      };
    },
    async submitForm() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/books/${this.book.maSach}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Thêm dòng này
            },
            body: JSON.stringify(this.book),
          }
        );

        if (!response.ok) throw new Error("Không thể cập nhật sách");

        this.hideModal();
        this.resetForm();
        this.$emit("book-updated");
      } catch (err) {
        alert("Lỗi khi cập nhật sách: " + err.message);
      }
    },
  },
};
</script>
