<template>
  <div
    class="modal fade"
    id="addBookModal"
    tabindex="-1"
    ref="addBookModalRef"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="saveBook">
          <div class="modal-header">
            <h5 class="modal-title">Thêm sách mới</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>

          <div class="modal-body">
            <input
              v-model="bookForm.tenSach"
              type="text"
              class="form-control mb-2"
              placeholder="Tên sách"
              required
            />
            <input
              v-model="bookForm.theLoai"
              type="text"
              class="form-control mb-2"
              placeholder="Thể loại"
              required
            />
            <input
              v-model="bookForm.tacGia"
              type="text"
              class="form-control mb-2"
              placeholder="Tác giả"
              required
            />
            <input
              v-model="bookForm.soQuyen"
              type="number"
              class="form-control mb-2"
              placeholder="Số quyển"
              required
            />
            <input
              v-model="bookForm.namXuatBan"
              type="number"
              class="form-control mb-2"
              placeholder="Năm xuất bản"
            />
            <input
              v-model="bookForm.nguonGoc"
              type="text"
              class="form-control mb-2"
              placeholder="Nguồn gốc"
            />
            <input
              v-model="bookForm.tenNXB"
              type="text"
              class="form-control mb-2"
              placeholder="Tên NXB"
            />
            <input
              v-model="bookForm.diaChiNXB"
              type="text"
              class="form-control mb-2"
              placeholder="Địa chỉ NXB"
            />

            <!-- Thay input text hình ảnh bằng input file -->
            <input
              type="file"
              class="form-control mb-2"
              accept="image/*"
              @change="handleFileUpload"
            />
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn btn-success">Lưu</button>
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";

export default {
  emits: ["book-added"],
  data() {
    return {
      modalInstance: null,
      bookForm: {
        tenSach: "",
        theLoai: "",
        tacGia: "",
        soQuyen: 1,
        donGia: null,
        namXuatBan: null,
        nguonGoc: "",
        tenNXB: "",
        diaChiNXB: "",
        imageFile: null, // ảnh sẽ được lưu ở đây
      },
    };
  },
  methods: {
    resetForm() {
      this.bookForm = {
        tenSach: "",
        theLoai: "",
        tacGia: "",
        soQuyen: 1,
        donGia: null,
        namXuatBan: null,
        nguonGoc: "",
        tenNXB: "",
        diaChiNXB: "",
        imageFile: null,
      };
    },
    handleFileUpload(event) {
      this.bookForm.imageFile = event.target.files[0];
    },
    async saveBook() {
      try {
        const formData = new FormData();
        for (const key in this.bookForm) {
          if (this.bookForm[key] !== null) {
            if (key === "imageFile" && this.bookForm[key]) {
              formData.append("image", this.bookForm[key]); // 👈 gửi với key "image"
            } else {
              formData.append(key, this.bookForm[key]);
            }
          }
        }

        const res = await fetch("http://localhost:3000/api/books", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Thêm sách thất bại");
        }

        const newBook = await res.json();
        this.$emit("book-added", newBook);
        this.closeModal();
      } catch (err) {
        alert("Lỗi: " + err.message);
        console.error(err);
      }
    },
    showModal() {
      this.modalInstance?.show();
    },
    closeModal() {
      if (document.activeElement) {
        document.activeElement.blur();
      }
      this.modalInstance?.hide();
    },
  },
  mounted() {
    this.modalInstance = Modal.getOrCreateInstance(this.$refs.addBookModalRef);
    window.addEventListener("open-add-book", () => {
      this.resetForm();
      this.showModal();
    });
  },
};
</script>
