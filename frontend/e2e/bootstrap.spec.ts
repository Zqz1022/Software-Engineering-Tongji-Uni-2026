import { expect, test } from '@playwright/test'

test('application navigation preserves the session and logout protects every page', async ({
  page,
}, testInfo) => {
  await page.goto('/')
  await expect(page).toHaveURL(new RegExp('/login$'))
  await page.getByLabel('选择联调账号').selectOption('1004')
  await page.getByRole('button', { name: '进入论坛' }).click()
  await expect(page.getByRole('heading', { name: '广场正在开发中' })).toBeVisible()
  await expect(page.getByText('开发用户四', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: '广场', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )
  // Keep the database connectivity check without exposing a diagnostic board page in the UI.
  const boards = await page.request.get('/api/v1/boards')
  expect(boards.ok()).toBe(true)
  expect((await boards.json()).items).toHaveLength(4)
  await page.screenshot({
    path: testInfo.outputPath('plaza-desktop.png'),
    fullPage: true,
    animations: 'disabled',
  })
  await page.getByRole('link', { name: '聊天', exact: true }).click()
  await expect(page).toHaveURL(new RegExp('/chat$'))
  await expect(page.getByRole('heading', { name: '聊天正在开发中' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: '聊天正在开发中' })).toBeVisible()
  await page.getByRole('link', { name: 'VIP', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'VIP正在开发中' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'VIP', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await page.goBack()
  await expect(page.getByRole('heading', { name: '聊天正在开发中' })).toBeVisible()
  const accountMenu = page.getByRole('button', { name: '账号菜单' })
  await accountMenu.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menuitem', { name: '编辑账号' })).toBeVisible()
  await page.screenshot({
    path: testInfo.outputPath('account-menu-desktop.png'),
    fullPage: true,
    animations: 'disabled',
  })
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menuitem', { name: '编辑账号' })).not.toBeVisible()
  await expect(accountMenu).toBeFocused()
  await accountMenu.click()
  await page.getByRole('menuitem', { name: '编辑账号' }).click()
  await expect(page).toHaveURL(new RegExp('/account$'))
  await expect(page.getByRole('heading', { name: '编辑账号正在开发中' })).toBeVisible()
  await accountMenu.click()
  await page.getByRole('menuitem', { name: '退出登录' }).click()
  await expect(page).toHaveURL(new RegExp('/login$'))
  expect((await page.request.get('/api/v1/boards')).status()).toBe(401)
  for (const path of ['/', '/chat', '/vip', '/account']) {
    await page.goto(path)
    await expect(page).toHaveURL(new RegExp('/login$'))
  }
})

test('login, navigation and avatar menu work on a phone viewport', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/login')
  await expect(page.getByRole('button', { name: '进入论坛' })).toBeVisible()
  await page.screenshot({
    path: testInfo.outputPath('login-mobile.png'),
    fullPage: true,
    animations: 'disabled',
  })
  await page.getByRole('button', { name: '进入论坛' }).click()
  await expect(page.getByRole('heading', { name: '广场正在开发中' })).toBeVisible()
  await page.getByRole('link', { name: '聊天', exact: true }).click()
  await expect(page.getByRole('heading', { name: '聊天正在开发中' })).toBeVisible()
  await page.getByRole('link', { name: 'VIP', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'VIP正在开发中' })).toBeVisible()
  await page.getByRole('button', { name: '账号菜单' }).click()
  await expect(page.getByRole('menuitem', { name: '编辑账号' })).toBeVisible()
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  expect(fits).toBe(true)
  await page.screenshot({
    path: testInfo.outputPath('vip-mobile.png'),
    fullPage: true,
    animations: 'disabled',
  })
  await page.getByRole('menuitem', { name: '编辑账号' }).click()
  await expect(page.getByRole('heading', { name: '编辑账号正在开发中' })).toBeVisible()
  await page.getByRole('button', { name: '账号菜单' }).click()
  await page.getByRole('menuitem', { name: '退出登录' }).click()
  await expect(page).toHaveURL(new RegExp('/login$'))
})
