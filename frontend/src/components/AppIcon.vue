<script setup lang="ts">
defineProps<{ name: 'plaza' | 'chat' | 'vip' | 'account' | 'chevron' | 'logout' }>()

const paths = {
  plaza: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  chat: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 2 2-6a8.5 8.5 0 1 1 18-4.5 M7 10h10 M7 14h6',
  vip: 'M3 6l5 4 4-7 4 7 5-4-2 12H5L3 6z M6 21h12',
  account: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-2a8 8 0 0 1 16 0v2',
  chevron: 'M6 9l6 6 6-6',
  logout: 'M9 4H4v16h5 M13 8l4 4-4 4 M8 12h13',
}
</script>

<template>
  <svg
    class="app-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name]" />
  </svg>
</template>
