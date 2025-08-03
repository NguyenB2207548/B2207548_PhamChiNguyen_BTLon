<template>
  <div class="container py-4">
    <h2 class="mb-4">Trang Quản Trị Nhân Viên</h2>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3" role="tablist">
      <li class="nav-item">
        <button
          class="nav-link active"
          data-bs-toggle="tab"
          data-bs-target="#users"
        >
          Tài khoản
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#borrows">
          Yêu cầu mượn
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#books">
          Sách
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content">
      <div class="tab-pane fade show active" id="users">
        <UserTable />
      </div>

      <div class="tab-pane fade" id="borrows">
        <BorrowRequests />
      </div>

      <div class="tab-pane fade" id="books">
        <BookTable @open-add-book="openAddBookModal" @edit-book="editBook" />
      </div>
    </div>

    <!-- Hai modal quản lý sách -->
    <AddBookModal />
    <EditBookModal
      :selectedBook="editingBook"
      @book-updated="reloadBooks"
      @modal-closed="handleEditModalClosed"
    />
  </div>
</template>

<script>
import UserTable from "@/components/UserTable.vue";
import BorrowRequests from "@/components/BorrowTable.vue";
import BookTable from "@/components/BookTable.vue";
import AddBookModal from "@/components/AddBookModal.vue";
import EditBookModal from "@/components/EditBookModal.vue";

export default {
  components: {
    UserTable,
    BorrowRequests,
    BookTable,
    AddBookModal,
    EditBookModal,
  },
  data() {
    return {
      editingBook: null,
    };
  },
  methods: {
    openAddBookModal() {
      window.dispatchEvent(new Event("open-add-book"));
    },
    editBook(book) {
      this.editingBook = book;
    },
    handleEditModalClosed() {
      this.editingBook = null; // 🧹 reset để tránh watch bị kích hoạt lại
    },
    reloadBooks() {
      window.dispatchEvent(new Event("reload-books"));
    },
  },
};
</script>

<style scoped>
.nav-tabs .nav-link.active {
  background-color: #0d6efd;
  color: white;
}
</style>
