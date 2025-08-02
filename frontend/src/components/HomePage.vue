<template>
  <div>
    <!-- Hero / Giới thiệu -->
    <section class="py-5 text-center header-intro">
      <div class="container">
        <h1 class="display-5 fw-bold">
          Chào mừng đến với Thư viện Library ctu
        </h1>
        <p class="lead">
          Khám phá hàng ngàn cuốn sách thuộc nhiều thể loại khác nhau, hoàn toàn
          miễn phí!
        </p>
        <a href="#" class="btn btn-primary mt-3">Bắt đầu khám phá</a>
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
            <div class="card text-center p-3 shadow-sm">
              <span>{{ category }}</span>
            </div>
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
        <a href="/register" class="btn btn-outline-light mt-3">Đăng ký ngay</a>
      </div>
    </section>
  </div>

  <div>
    <!-- Footer -->
    <footer class="bg-light text-center text-muted py-4 mt-5">
      <div class="container">
        <p class="mb-1">&copy; 2025 Thư viện Library. All rights reserved.</p>
        <div>
          <a href="#" class="text-muted me-3">Giới thiệu</a>
          <a href="#" class="text-muted me-3">Liên hệ</a>
          <a href="#" class="text-muted">Chính sách</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      categories: [
        "Tiểu thuyết",
        "Khoa học",
        "Tâm lý",
        "Thiếu nhi",
        "Lịch sử",
        "Kinh tế",
      ],
      newBooks: [
        {
          title: "Đắc nhân tâm",
          author: "Dale Carnegie",
          image: "https://via.placeholder.com/150x220",
        },
        {
          title: "Nhà giả kim",
          author: "Paulo Coelho",
          image: "https://via.placeholder.com/150x220",
        },
        {
          title: "1984",
          author: "George Orwell",
          image: "https://via.placeholder.com/150x220",
        },
        {
          title: "Sapiens",
          author: "Yuval Noah Harari",
          image: "https://via.placeholder.com/150x220",
        },
      ],
      popularBooks: [
        {
          title: "Harry Potter",
          author: "J.K. Rowling",
          image: "https://via.placeholder.com/150x220",
        },
        {
          title: "Bố già",
          author: "Mario Puzo",
          image: "https://via.placeholder.com/150x220",
        },
        {
          title: "Totto-chan",
          author: "Tetsuko Kuroyanagi",
          image: "https://via.placeholder.com/150x220",
        },
      ],
    };
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
