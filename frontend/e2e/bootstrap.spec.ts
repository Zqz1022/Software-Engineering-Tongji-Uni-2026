import { expect, test } from '@playwright/test'

test('ordinary development session reads MySQL boards and is invalidated on logout', async ({
  page,
}, testInfo) => {
  await page.goto('/')
  await expect(page).toHaveURL(new RegExp('/login$'))
  await page.getByLabel('选择联调账号').selectOption('1004')
  await page.getByRole('button', { name: '进入论坛' }).click()
  await expect(page.getByRole('heading', { name: '课程组队' })).toBeVisible()
  await expect(page.getByText('开发用户四', { exact: true })).toBeVisible()
  await expect(page.locator('.board-card')).toHaveCount(4)
  await page.screenshot({ path: testInfo.outputPath('boards-desktop.png'), fullPage: true })
  await page.reload()
  await expect(page.getByRole('heading', { name: '学习交流' })).toBeVisible()
  await page.getByRole('button', { name: '退出登录' }).click()
  await expect(page).toHaveURL(new RegExp('/login$'))
  await page.goto('/')
  await expect(page).toHaveURL(new RegExp('/login$'))
})

test('login and board layout fit a phone viewport', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/login')
  await expect(page.getByRole('button', { name: '进入论坛' })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('login-mobile.png'), fullPage: true })
  await page.getByRole('button', { name: '进入论坛' }).click()
  await expect(page.getByRole('heading', { name: '课程组队' })).toBeVisible()
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)
  expect(fits).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('boards-mobile.png'), fullPage: true })
})
