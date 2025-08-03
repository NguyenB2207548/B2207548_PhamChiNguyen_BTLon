<template>
  <div>
    <h4>Quản lý sách</h4>
    <button class="btn btn-primary mb-3 mt-2" @click="openAddBookModal">
      + Thêm sách
    </button>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Tên sách</th>
          <th>Thể loại</th>
          <th>Tác giả</th>
          <th>Số quyển</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.maSach">
          <td>{{ book.tenSach }}</td>
          <td>{{ book.theLoai }}</td>
          <td>{{ book.tacGia }}</td>
          <td>{{ book.soQuyen }}</td>
          <td>
            <button class="btn btn-warning btn-sm mx-1" @click="editBook(book)">
              Sửa
            </button>
            <button
              class="btn btn-danger btn-sm mx-1"
              @click="deleteBook(book.maSach)"
            >
              Xóa
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [],
    };
  },
  methods: {
    async fetchBooks() {
      try {
        const res = await fetch("http://localhost:3000/api/books");
        this.books = await res.json();
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sách:", err);
      }
    },
    openAddBookModal() {
      this.$emit("open-add-book");
    },
    editBook(book) {
      this.$emit("edit-book", book); // Sửa sách -> emit về Admin.vue
    },
    async deleteBook(id) {
      if (confirm("Xóa sách này?")) {
        try {
          await fetch(`http://localhost:3000/api/books/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          this.fetchBooks(); // Refresh danh sách
        } catch (err) {
          alert("Lỗi khi xóa sách: " + err.message);
        }
      }
    },
  },
  mounted() {
    this.fetchBooks();

    // Lắng nghe sự kiện để refresh từ modal cha sau khi thêm/cập nhật
    window.addEventListener("refresh-book-table", this.fetchBooks);
  },
  unmounted() {
    window.removeEventListener("refresh-book-table", this.fetchBooks);
  },
};
</script>
