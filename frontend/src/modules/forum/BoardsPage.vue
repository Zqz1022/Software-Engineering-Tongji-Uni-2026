<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElAlert, ElButton } from 'element-plus'
import { useRouter } from 'vue-router'
import { api, ApiError, type Board } from '../../api/client'
import { useSessionStore } from '../auth/session'

const session = useSessionStore()
const router = useRouter()
const boards = ref<Board[]>([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    boards.value = (await api.boards()).items
  } catch (cause) {
    if (cause instanceof ApiError && cause.status === 401) {
      session.user = null
      await router.replace('/login')
    } else {
      error.value = cause instanceof Error ? cause.message : '板块加载失败'
    }
  } finally {
    loading.value = false
  }
}

async function logout() {
  try {
    await session.logout()
    await router.replace('/login')
  } catch {
    error.value = '退出失败，请重试。'
  }
}

onMounted(load)
</script>

<template>
  <div class="forum-layout">
    <header class="topbar">
      <RouterLink class="brand" to="/">同济校园论坛</RouterLink>
      <div class="user-menu">
        <span>{{ session.user?.displayName }}</span><el-button text @click="logout"
          >退出登录</el-button
        >
      </div>
    </header>
    <main class="content">
      <p class="eyebrow">OUR CAMPUS, OUR CONVERSATIONS</p>
      <h1>从一个话题开始。</h1>
      <p class="muted">校园里的每一次交流，都值得被认真听见。</p>
      <el-alert v-if="error" :title="error" type="error" :closable="false" show-icon role="alert" />
      <el-button v-if="error" class="retry" @click="load">重新加载</el-button>
      <p v-if="loading" role="status">正在加载板块…</p>
      <div v-else-if="!error" class="board-grid">
        <article v-for="(board, index) in boards" :key="board.id" class="board-card">
          <span class="board-number">0{{ index + 1 }}</span>
          <h2>{{ board.name }}</h2>
          <p>{{ board.description }}</p>
        </article>
        <p v-if="boards.length === 0" class="muted">暂无开放的板块。</p>
      </div>
    </main>
    <footer>同济大学 · 2026 软件工程课程设计</footer>
  </div>
</template>
