<script setup lang="ts">
import { ref } from 'vue'
import {
  ElAlert,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  type DropdownInstance,
} from 'element-plus'
import { useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import { useSessionStore } from '../modules/auth/session'

const router = useRouter()
const session = useSessionStore()
const error = ref('')
const loggingOut = ref(false)
const accountDropdown = ref<DropdownInstance>()
const accountTrigger = ref<HTMLButtonElement>()
const navigation = [
  { to: '/', label: '广场' },
  { to: '/chat', label: '聊天' },
  { to: '/vip', label: 'VIP' },
]

function closeAccountMenu() {
  accountDropdown.value?.handleClose()
  accountTrigger.value?.focus()
}

async function handleAccountCommand(command: string) {
  if (command === 'account') {
    await router.push('/account')
    return
  }
  if (command !== 'logout' || loggingOut.value) return
  loggingOut.value = true
  error.value = ''
  try {
    await session.logout()
    await router.replace('/login')
  } catch {
    error.value = '退出失败，请重试。'
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <div class="app-layout">
    <a class="skip-link" href="#main-content">跳转到主要内容</a>
    <header class="app-header">
      <div class="topbar">
        <RouterLink class="brand" to="/" aria-label="同济校园论坛首页">
          <span class="brand-mark" aria-hidden="true">同</span>
          <span>同济校园论坛</span>
        </RouterLink>
        <nav class="primary-nav" aria-label="主要导航">
          <RouterLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="nav-link"
            exact-active-class="nav-link--active"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
        <el-dropdown
          ref="accountDropdown"
          class="account-dropdown"
          trigger="click"
          placement="bottom-end"
          @command="handleAccountCommand"
        >
          <button
            ref="accountTrigger"
            class="account-trigger"
            type="button"
            aria-label="账号菜单"
            :disabled="loggingOut"
            @keydown.esc.stop.prevent="closeAccountMenu"
          >
            <span class="avatar"><AppIcon name="account" /></span>
            <span class="account-name">{{ session.user?.displayName }}</span>
            <AppIcon name="chevron" />
          </button>
          <template #dropdown>
            <el-dropdown-menu
              class="account-menu"
              @keydown.esc.capture.stop.prevent="closeAccountMenu"
            >
              <el-dropdown-item command="account">
                <AppIcon name="account" />编辑账号
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided :disabled="loggingOut">
                <AppIcon name="logout" />退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <main id="main-content" class="app-content" tabindex="-1">
      <el-alert v-if="error" :title="error" type="error" :closable="false" show-icon role="alert" />
      <RouterView />
    </main>
    <footer class="app-footer">
      <span>同济校园论坛</span>
      <span>相聚校园，让交流发生。</span>
    </footer>
  </div>
</template>
