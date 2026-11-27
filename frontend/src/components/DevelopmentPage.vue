<script setup lang="ts">
import AppIcon from './AppIcon.vue'

defineProps<{
  title: string
  subtitle: string
  description: string
  icon: 'plaza' | 'chat' | 'vip' | 'account'
}>()
</script>

<template>
  <section class="feature-page" aria-labelledby="page-title">
    <header class="page-heading">
      <h1 id="page-title">{{ title }}</h1>
      <p>{{ subtitle }}</p>
    </header>
    <div class="development-panel">
      <div class="feature-illustration" :class="`feature-illustration--${icon}`">
        <AppIcon :name="icon" />
      </div>
      <span class="development-badge"><span></span>开发中</span>
      <h2>{{ title }}正在开发中</h2>
      <p>{{ description }}</p>
      <span class="development-note">新的校园体验，即将与你见面。</span>
    </div>
  </section>
</template>
