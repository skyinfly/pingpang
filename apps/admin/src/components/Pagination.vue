<template>
  <div class="pagination" v-if="total > 0">
    <button type="button" class="ghost-action" :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
    <span class="pagination-info">第 {{ page }} 页 / 共 {{ totalPages }} 页 (总 {{ total }} 条)</span>
    <button type="button" class="ghost-action" :disabled="page >= totalPages" @click="changePage(page + 1)">下一页</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  page: number;
  pageSize: number;
  total: number;
}>();

const emit = defineEmits<{
  (e: 'update:page', page: number): void;
  (e: 'change', page: number): void;
}>();

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));

function changePage(newPage: number) {
  if (newPage >= 1 && newPage <= totalPages.value) {
    emit('update:page', newPage);
    emit('change', newPage);
  }
}
</script>

<style scoped>
.pagination {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  align-items: center;
}
.pagination-info {
  font-size: 13px;
  color: #657168;
}
</style>
