<template>
  <div class="container my-4">
    <!-- Bộ lọc thể loại -->
    <div class="row mb-4">
      <div class="col-md-4">
        <select
          v-model="selectedCategory"
          @change="filterBooks"
          class="form-select"
        >
          <option value="">Tất cả thể loại</option>
          <option v-for="theLoai in theLoais" :key="theLoai" :value="theLoai">
            {{ theLoai }}
          </option>
        </select>
      </div>
      <div class="col-md-4">
        <select
          v-model="selectedAuthor"
          @change="filterBooks"
          class="form-select"
        >
          <option value="">Tất cả tác giả</option>
          <option v-for="author in tacGias" :key="author" :value="author">
            {{ author }}
          </option>
        </select>
      </div>
    </div>

    <!-- Danh sách sách -->
    <div class="row">
      <div v-for="book in filteredBooks" :key="book._id" class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img
            :src="
              book.hinhAnh
                ? `http://localhost:3000${book.hinhAnh}`
                : 'https://placehold.co/150x220?text=No+Image'
            "
            class="card-img-top"
            alt="Book Cover"
          />
          <div class="card-body d-flex flex-column">
            <h6 class="card-title mb-1 text-truncate">{{ book.tenSach }}</h6>
            <p class="text-muted mb-1">Thể loại: {{ book.theLoai }}</p>
            <p class="text-muted mb-1">Tác giả: {{ book.tacGia }}</p>
            <p class="text-muted small mb-1">
              Năm xuất bản: {{ book.namXuatBan }}
            </p>
            <p class="text-muted mb-2">Số quyển: {{ book.soQuyen }}</p>
            <router-link
              class="btn btn-outline-primary mt-auto"
              :to="`/products/${book.maSach}`"
            >
              Chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredBooks.length === 0" class="text-muted">
      Không tìm thấy sách nào.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [],
      filteredBooks: [],
      selectedCategory: "",
      selectedAuthor: "",
      theLoais: [],
      tacGias: [],
    };
  },
  async mounted() {
    try {
      const res = await fetch("http://localhost:3000/api/books");
      const data = await res.json();
      this.books = data;
      this.extractCategories();
      this.extractAuthors();

      const query = this.$route.query.search || "";
      const categoryFromQuery = this.$route.query.category;

      if (categoryFromQuery) {
        this.selectedCategory = categoryFromQuery;
      }

      this.filterBooks(query);
    } catch (err) {
      console.error("Lỗi khi lấy sách:", err);
    }
  },
  methods: {
    filterBooks(searchText = "") {
      this.filteredBooks = this.books.filter((book) => {
        const matchesSearch = book.tenSach
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const matchesCategory =
          !this.selectedCategory || book.theLoai === this.selectedCategory;
        const matchesAuthor =
          !this.selectedAuthor || book.tacGia === this.selectedAuthor;

        return matchesSearch && matchesCategory && matchesAuthor;
      });
    },
    extractCategories() {
      const categories = new Set(this.books.map((b) => b.theLoai));
      this.theLoais = Array.from(categories);
    },
    extractAuthors() {
      const authors = new Set(this.books.map((b) => b.tacGia));
      this.tacGias = Array.from(authors);
    },
  },
  watch: {
    selectedCategory() {
      const query = this.$route.query.search || "";
      this.filterBooks(query);
    },
    selectedAuthor() {
      const query = this.$route.query.search || "";
      this.filterBooks(query);
    },
    "$route.query.search"(newQuery) {
      this.filterBooks(newQuery || "");
    },
  },
};
</script>

<style scoped>
.card-img-top {
  height: 220px;
  object-fit: cover;
}
</style>
