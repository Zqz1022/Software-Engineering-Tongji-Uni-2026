<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElAlert, ElButton, ElTag } from 'element-plus'
import { useRouter } from 'vue-router'
import { api } from '../../api/client'
import { useSessionStore } from './session'

const session = useSessionStore()
const router = useRouter()
const enabled = ref(false)
const ready = ref(false)
const busy = ref(false)
const userId = ref(1001)
const error = ref('')

onMounted(async () => {
  try {
    enabled.value = (await api.options()).devLoginEnabled
    ready.value = true
  } catch {
    error.value = '暂时无法连接服务，请稍后刷新重试。'
  }
})

async function login() {
  busy.value = true
  error.value = ''
  try {
    await session.login(userId.value)
    await router.push('/')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '登录失败，请重试'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <main class="login-layout">
    <section class="intro">
      <p class="eyebrow">TONGJI CAMPUS FORUM</p>
      <h1>相聚校园，<br />让交流发生。</h1>
      <p>寻找课程伙伴，分享学习心得，发现校园里的新鲜事。</p>
      <div class="intro-tags"><span>课程组队</span><span>学习交流</span><span>校园生活</span></div>
    </section>
    <section class="login-card" aria-labelledby="login-title">
      <h2 id="login-title">欢迎来到同济校园论坛</h2>
      <p class="muted">登录后进入校园交流空间。</p>
      <el-alert v-if="error" :title="error" type="error" :closable="false" show-icon role="alert" />
      <form v-if="enabled" class="login-form" @submit.prevent="login">
        <el-tag type="warning" effect="plain">本地开发环境</el-tag>
        <label for="dev-user">选择联调账号</label>
        <select id="dev-user" v-model="userId" :disabled="busy">
          <option :value="1001">开发用户一</option>
          <option :value="1002">开发用户二</option>
          <option :value="1003">开发用户三</option>
          <option :value="1004">开发用户四</option>
        </select>
        <el-button type="primary" native-type="submit" :loading="busy">进入论坛</el-button>
        <p class="small muted">这些账号供小组开发联调使用，拥有普通用户权限。</p>
      </form>
      <p v-else-if="ready" class="muted">QQ／微信登录接入后开放使用。</p>
      <p v-else-if="!error" class="muted" role="status">正在连接服务…</p>
    </section>
  </main>
</template>
