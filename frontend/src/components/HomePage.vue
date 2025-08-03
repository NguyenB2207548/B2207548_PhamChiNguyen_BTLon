<template>
  <div>
    <!-- Giới thiệu -->
    <section class="py-5 text-center header-intro">
      <div class="container">
        <h1 class="display-5 fw-bold">
          Chào mừng đến với Thư viện Library ctu
        </h1>
        <p class="lead">
          Khám phá hàng ngàn cuốn sách thuộc nhiều thể loại khác nhau, hoàn toàn
          miễn phí!
        </p>
        <router-link to="/products" class="btn btn-success mt-3"
          >Bắt đầu khám phá</router-link
        >
      </div>
    </section>

    <!-- Thể loại -->
    <section class="py-5">
      <div class="container">
        <h2 class="mb-4">Thể loại phổ biến</h2>
        <div class="row g-3">
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="col-6 col-md-2"
          >
            <router-link
              :to="{ path: '/products', query: { category: category } }"
              class="card text-center p-3 shadow-sm text-decoration-none text-dark"
            >
              <span>{{ category }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Sách mới -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="mb-4">Sách mới cập nhật</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          <div
            class="col"
            v-for="(book, index) in newBooks"
            :key="'new-' + index"
          >
            <div class="card h-100 shadow-sm">
              <img :src="book.image" class="card-img-top" alt="book.title" />
              <div class="card-body">
                <h5 class="card-title">{{ book.title }}</h5>
                <p class="card-text">Tác giả: {{ book.author }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sách phổ biến -->
    <section class="py-5">
      <div class="container">
        <h2 class="mb-4">Sách được mượn nhiều</h2>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          <div
            class="col"
            v-for="(book, index) in popularBooks"
            :key="'popular-' + index"
          >
            <div class="card h-100 shadow-sm">
              <img :src="book.image" class="card-img-top" alt="book.title" />
              <div class="card-body">
                <h5 class="card-title">{{ book.title }}</h5>
                <p class="card-text">Tác giả: {{ book.author }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA đăng ký -->
    <section class="py-5 bg-dark text-light text-center">
      <div class="container">
        <h2>Tham gia cùng hơn 10.000 bạn đọc</h2>
        <p class="lead">
          Đăng ký tài khoản ngay để mượn sách trực tuyến và quản lý tủ sách của
          bạn.
        </p>
        <a
          href="#"
          class="btn btn-outline-light mt-3"
          data-bs-toggle="modal"
          data-bs-target="#registerModal"
        >
          Đăng ký ngay
        </a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      categories: [],
      newBooks: [],
      popularBooks: [],
    };
  },
  mounted() {
    this.fetchGenres();
    this.fetchNewBooks();
    this.fetchPopularBooks();
  },
  methods: {
    async fetchGenres() {
      try {
        const res = await fetch("http://localhost:3000/api/books/genres");
        const data = await res.json();
        this.categories = data.sort((a, b) => a.localeCompare(b));
      } catch (error) {
        console.error("Lỗi khi tải thể loại:", error);
      }
    },
    async fetchNewBooks() {
      try {
        const response = await fetch("http://localhost:3000/api/books/newest");
        const data = await response.json();
        this.newBooks = data.map((book) => ({
          title: book.tenSach,
          author: book.tacGia,
          image: book.hinhAnh.startsWith("/")
            ? "http://localhost:3000" + book.hinhAnh
            : book.hinhAnh,
        }));
      } catch (error) {
        console.error("Lỗi khi tải sách mới:", error);
      }
    },
    async fetchPopularBooks() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/books/mostBorrowed"
        );
        const data = await response.json();
        this.popularBooks = data.map((book) => ({
          title: book.tenSach,
          author: book.tacGia,
          image: book.hinhAnh.startsWith("/")
            ? "http://localhost:3000" + book.hinhAnh
            : book.hinhAnh,
        }));
      } catch (error) {
        console.error("Lỗi khi tải sách phổ biến:", error);
      }
    },
  },
};
</script>

<style scoped>
.header-intro {
  background-color: #faf8f6;
}
.card-title {
  font-weight: 600;
  font-size: 1.1rem;
}
.card-text {
  font-size: 0.95rem;
}
</style>
