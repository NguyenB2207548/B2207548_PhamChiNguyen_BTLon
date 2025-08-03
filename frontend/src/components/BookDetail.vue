<template>
  <div class="container py-5 mx-auto">
    <!-- Chi tiết sách -->
    <div class="row mb-5">
      <div class="col-md-5">
        <img
          :src="`http://localhost:3000${book.hinhAnh}`"
          class="img-fluid rounded shadow-sm"
          alt="Ảnh sách"
          style="width: 100%; object-fit: cover"
        />
      </div>
      <div class="col-md-6 ms-2">
        <h2 class="fw-bold mb-3">{{ book.tenSach }}</h2>
        <p><strong>Tác giả:</strong> {{ book.tacGia }}</p>
        <p><strong>Thể loại:</strong> {{ book.theLoai }}</p>
        <p><strong>Năm xuất bản:</strong> {{ book.namXuatBan }}</p>
        <p><strong>Nguồn gốc:</strong> {{ book.nguonGoc }}</p>
        <p><strong>Số quyển còn lại:</strong> {{ book.soQuyen }}</p>

        <button
          class="btn btn-primary mt-3"
          data-bs-toggle="modal"
          data-bs-target="#borrowModal"
        >
          Đăng ký mượn sách
        </button>

        <BorrowModal :maSach="book.maSach" :userId="userId" />
      </div>
    </div>

    <!-- Gợi ý sách cùng thể loại -->
    <div class="mt-4">
      <h5 class="mb-3">📚 Sách cùng thể loại</h5>
      <div v-if="similarBooks.length > 0" class="row">
        <div
          v-for="suggestion in similarBooks"
          :key="suggestion._id"
          class="col-sm-6 col-md-3 mb-4"
        >
          <div class="card h-100 shadow-sm" style="font-size: 0.85rem">
            <img
              :src="`http://localhost:3000${suggestion.hinhAnh}`"
              class="card-img-top"
              alt="Ảnh gợi ý"
              style="height: 140px; object-fit: cover"
            />
            <div
              class="card-body p-2 d-flex flex-column justify-content-between"
            >
              <div>
                <h6 class="card-title mb-1">{{ suggestion.tenSach }}</h6>
                <p class="card-text text-muted mb-2">
                  Tác giả: {{ suggestion.tacGia }}
                </p>
              </div>
              <router-link
                :to="`/products/${suggestion.maSach}`"
                class="btn btn-outline-primary btn-sm w-100"
              >
                Xem chi tiết
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-secondary text-center">
        Không có sách phù hợp
      </div>
    </div>
  </div>
</template>

<script>
import BorrowModal from "../modals/BorrowModal.vue";

export default {
  name: "BookDetail",
  components: { BorrowModal },
  data() {
    return {
      book: {},
      similarBooks: [],
      userId: null,
    };
  },
  methods: {
    async fetchBook() {
      const maSach = this.$route.params.id;

      const res = await fetch(`http://localhost:3000/api/books/${maSach}`);
      const bookData = await res.json();
      this.book = bookData;

      const res2 = await fetch(
        `http://localhost:3000/api/books/sameCategory?theLoai=${bookData.theLoai}&maSach=${bookData.maSach}`
      );
      const similar = await res2.json();
      this.similarBooks = similar.slice(0, 4);
    },
  },
  mounted() {
    this.fetchBook();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) this.userId = user._id;
  },
  watch: {
    "$route.params.id"(newId) {
      this.fetchBook(); // gọi lại khi id thay đổi
    },
  },
};
</script>

<style scoped>
.card-title {
  font-size: 0.95rem;
  font-weight: 600;
}
</style>
