# 框架验证记录

| 项目 | 内容 |
| --- | --- |
| 日期 | 2026-11-24 |
| 分支 | chore/project-bootstrap |
| 范围 | 前后端骨架、MySQL 迁移、开发会话、受保护板块接口、契约、CI 配置和容器模板 |
| 执行方式 | OpenAI Codex 在本地执行命令与浏览器验证；人工评审记录由对应 PR 保存 |
| 环境 | macOS arm64、Java 21、Node.js 22.23.1、pnpm 10.32.1、Maven Wrapper 3.9.13、MySQL 8.4.8 |

## 1. 检查结果

| 检查 | 结果与证据范围 |
| --- | --- |
| pnpm install --frozen-lockfile | 通过；按锁文件重新安装，前端依赖不依赖临时 pnpm store |
| 前端格式、契约同步、类型检查和生产构建 | 通过；OpenAPI 校验及生成类型一致，Vue／TypeScript 构建成功 |
| pnpm test | 2 个测试文件、5 项测试通过；覆盖 CSRF 请求头、认证错误、非 JSON 错误与会话状态 |
| ./mvnw verify | 3 项单元测试、7 项真实 MySQL 集成测试通过，0 失败、0 跳过，成功打包 |
| pnpm test:e2e | Chromium 2 项验收通过；桌面登录、板块读取、刷新保持会话、退出失效，以及 390px 手机布局 |
| 空库迁移与重启 | 开发与测试库成功执行版本迁移及开发数据初始化；再次启动校验迁移并复用原数据 |
| 环境隔离 | 打包后的应用以 prod,dev 混合配置启动被拒绝，发生在数据库迁移前 |
| Compose 与工作流配置 | 开发和部署 Compose 解析通过；CI 与 Issue 模板 YAML 解析通过 |
| 容器镜像 | 两个 Dockerfile 均完成镜像构建，后端容器构建使用 Java 21，前端按锁文件安装并校验契约后构建 |
| 本地 prod 容器验证 | Nginx 页面与 API 代理正常；未登录访问板块返回 401；带合法 CSRF 的开发登录请求返回 404；会话 Cookie 包含 Secure、HttpOnly、SameSite=Lax |
| prod 数据隔离 | 新建隔离部署数据库中 app_user 为 0 条，forum_board 为 4 条，未加载开发账号 |

GitHub Actions 的远端运行记录在分支推送后产生；本表记录本地执行结果，不等同于远端检查或人工评审已经完成。

## 2. 后端覆盖与关键行为

JaCoCo 报告针对当前框架 Java 代码：行覆盖 99／106（93.4%），分支覆盖 16／18（88.9%）。范围包括环境策略、会话入口、用户状态检查、板块读取与公共错误处理；不包含尚未实现的第三方登录、私聊、支付和管理业务。

集成测试使用独立 MySQL 测试库，验证：

- 未登录读取当前用户或板块时返回 JSON 401。
- 写请求缺少 CSRF 被拒绝；固定开发身份范围之外的请求及额外角色字段被拒绝。
- 登录更换会话标识，Cookie 为 HttpOnly，身份和会话属性写入 Spring Session 表。
- 板块结果来自数据库，关闭板块后结果更新；登录后再限制账号也不能继续读取。
- 注销移除持久会话，旧 Cookie 失效；登录前的 CSRF token 不能用于登录后的写请求。
- 关闭开发登录配置后，接口不注册，登录能力响应为 false。

验证过程中发现 MockMvc 集成环境下默认会话 Cookie 未呈现 HttpOnly，随后显式配置 Spring Session CookieSerializer，重新运行全部后端检查通过。前端组件改为按需引入后，生产构建不再出现整库导入造成的大包警告。

## 3. 复现与记录位置

复现命令见 [开发指南](README.md) 和仓库 [README](../../README.md)。后端报告输出到 target/surefire-reports、target/failsafe-reports 和 target/site/jacoco；浏览器报告、桌面及手机截图输出到 frontend/playwright-report 和 frontend/test-results。这些生成物由 .gitignore 排除，CI 使用 Artifact 保存。

本次在 Docker Hub 连接失败时，从公开 ECR 的 Docker 官方镜像镜像源下载相同版本并赋予本地标签；Maven 使用临时独立配置访问 Maven Central，未修改个人 Maven 配置。测试结束后停止本次启动的服务，保留开发数据库卷，移除仅用于 prod 验证的隔离容器和数据卷。

本次新增应用骨架、页面、测试与配置由 Codex 辅助生成和调整，AI 辅助比例估计约 100%；Maven Wrapper 来自官方工具生成，依赖锁文件与接口类型来自相应工具。项目组仍通过 PR 记录代码理解、人工修改与合并放行。

## 4. 启动环境修正（2026-11-24）

针对首次按 README 启动时继承个人 Maven 公司仓库、pnpm 未安装的问题，补充项目级 Maven 配置与缓存隔离、公共 npm 仓库配置，以及 Node／pnpm 的明确准备步骤。个人 Maven 配置和其他 Node 版本的工具保持原样。

- 在 backend 直接执行 Wrapper 的 help:effective-settings 和 test，未传临时 settings 参数；3 项单元测试通过。
- 生效配置只包含 course-maven-central 镜像，mirrorOf 为 *，地址为 https://repo.maven.apache.org/maven2；依赖缓存位于 backend/.cache/maven/repository。
- 检查本次从独立缓存开始下载的日志，所有下载请求均来自 repo.maven.apache.org，没有访问公司仓库。
- Node 22.23.1 环境安装 pnpm 10.32.1 后，实际执行 nvm use、pnpm --version 和 registry 查询，版本与公共仓库地址符合文档；前端格式检查、类型检查及构建通过。
- GitHub Actions 缓存路径已同步为项目缓存；Docker 构建上下文排除所有 .cache 目录。

## 5. 应用主界面原型调整（2026-11-24）

登录后的首页改为应用公共布局，顶部提供广场、聊天、VIP 导航，右上角默认头像展开编辑账号与退出登录菜单。四个功能页均展示对应的开发中提示，原示例板块卡片页移除。各业务页沿用同一登录保护，板块接口继续用于联调与数据库联通验证。

- 前端格式检查、OpenAPI 类型同步、Vue／TypeScript 类型检查及生产构建通过，现有 5 项单元测试通过。
- 更新后的 Chromium 2 项浏览器测试通过：桌面端切换导航、刷新与浏览器返回、头像菜单键盘开启与 Esc 关闭、编辑账号入口、退出登录以及所有业务路径的未登录重定向；390px 手机端导航、菜单与退出流程正常，无横向溢出。
- 浏览器测试复用本机运行的前后端，带会话请求读取 4 个数据库板块，退出后同一接口返回 401。桌面和手机截图已检查，生成物仍位于 frontend/test-results。
- 本次只调整前端、浏览器测试及使用说明，未重新执行后端完整集成测试或部署镜像构建。账号资料编辑、真实头像、论坛内容、私聊、VIP 充值和装扮仍由后续功能任务实现。
