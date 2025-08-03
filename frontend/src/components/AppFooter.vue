<template>
  <footer class="bg-light text-center text-muted py-4 mt-5">
    <div class="container">
      <p class="mb-1">&copy; 2025 Thư viện Library ctu. All rights reserved.</p>
      <div>
        <router-link to="/gioi-thieu" class="text-muted me-3"
          >Giới thiệu</router-link
        >
        <router-link to="/lien-he" class="text-muted me-3">Liên hệ</router-link>
        <router-link to="/chinh-sach" class="text-muted"
          >Chính sách</router-link
        >
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>
