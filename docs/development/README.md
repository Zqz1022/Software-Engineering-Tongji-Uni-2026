# 开发与协作指南

技术与流程依据：[项目框架与协作开发约定](project-bootstrap-and-collaboration.md)。当前框架在 `chore/project-bootstrap` 上推进，需求材料使用独立 PR。

## 1. 环境与首次启动

| 工具 | 版本与检查 |
| --- | --- |
| JDK | Java 21，执行 `java -version`；IDE 项目 SDK 也设为 21 |
| Node.js | 22.23.1，根目录提供 `.nvmrc`；nvm 用户可执行 `nvm install`、`nvm use` |
| pnpm | 10.32.1，可通过 `npm install --global pnpm@10.32.1` 安装；执行 `pnpm --version` 确认 |
| Maven | Wrapper 固定 3.9.13，使用 `backend/mvnw` 或 `mvnw.cmd` |
| Docker | 启动 Docker Desktop 或其他兼容引擎，并确认 `docker compose version` 可用 |

按根目录 [README](../../README.md) 启动数据库、后端和前端。Windows PowerShell 使用 `Copy-Item .env.example .env`，并在 backend 中执行 `.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev`；其余 pnpm 和 Docker 命令相同。

| 服务 | 默认地址或端口 | 数据与用途 |
| --- | --- | --- |
| 前端 | http://127.0.0.1:5173 | Vite 代理 /api 到后端，浏览器使用同源 Cookie |
| 后端 | http://127.0.0.1:8080 | /actuator/health 为健康检查，业务接口统一 /api/v1 |
| 开发 MySQL | 127.0.0.1:3307 | campus_forum；Docker 数据卷保存开发数据 |
| 测试 MySQL | 127.0.0.1:3308 | campus_forum_test；独立容器临时文件系统，不能用于保留开发数据 |

默认本地数据库配置与 `.env.example` 一致。根目录 `.env` 只由 Compose 读取，Spring Boot 不会自动读取它；改动数据库端口或凭据时，同步给后端设置 `DB_URL`、`DB_USERNAME`、`DB_PASSWORD`。测试连接使用 `TEST_DB_URL`、`TEST_DB_USERNAME`、`TEST_DB_PASSWORD`。

例如自定义后端端口时设置 `SERVER_PORT`，并在启动前端时设置 `API_PROXY_TARGET`。统一使用浏览器入口的同一主机名，避免 localhost 与 127.0.0.1 混用造成 Cookie 不一致。开发服务用于本机联调，不向公网暴露。

## 2. 当前可用能力

- Flyway 管理 Spring Session 表、基础用户表和板块表；迁移写入四个校园板块。
- dev/test 配置额外加载四个固定普通用户，ID 为 1001—1004。正式迁移不创建这些用户。
- 页面先获取 CSRF token，再建立开发会话；登录更换会话标识与 CSRF token，JDBC 持久化会话。
- 板块和当前用户接口要求有效会话及正常账号；退出注销服务端会话。
- 默认配置关闭开发登录；prod 与 dev/test 混用，或在非开发环境强行启用开发登录，均在常规 Bean 初始化与迁移前拒绝启动。

开发登录是联调替身，不是 QQ／微信登录实现，也不是独立注册方式。框架不宣布任何完整用户故事验收完成。真实第三方登录需实现渠道身份核验、账号映射和回调上下文校验；支付、聊天和管理功能在相应模块内实现。

## 3. 四人并行工作方式

1. 在 Issue 中确定 US／工程任务、主要负责人、验收条件、依赖和 Milestone。姓名分配在 Issue 中记录。
2. 框架 PR 合入后，从最新 main 创建短期任务分支；框架合入前需要联调时，可使用当前分支查看或运行，避免把独立需求 PR 的内容带入框架提交。
3. 在对应业务模块添加页面、接口、测试与迁移。修改共享契约、登录规则或公共目录前，在 Issue／PR 中说明影响。
4. 先用 OpenAPI 约定接口，执行类型生成；前端可围绕接口开发，后端用验收场景验证行为。
5. 本地检查通过后提交 PR，附验证证据和 AI 使用说明。部分工作用 Refs，完整交付才用 Closes。
6. 非作者成员评审，组长统筹集成与合并；跨迭代交换结对或评审对象。

| 业务方向 | 前端目录 | 后端目录与协作重点 |
| --- | --- | --- |
| 工程、账号和权限 | src/modules/auth、src/api、src/router | auth、user、common；保持统一会话与授权入口 |
| 论坛与公开内容治理 | src/modules/forum、src/modules/moderation | forum、moderation；作者权限、版主范围与审计 |
| 私聊 | src/modules/chat | chat；消息持久化、参与者权限、未读、重试与拉黑 |
| VIP 与支付 | src/modules/membership | membership；支付适配、幂等发放、到期与展示 |

Spring Boot、MyBatis、Flyway 等库的具体版本固定在 pom 和父 BOM 中；前端依赖与 pnpm 锁文件一起提交。禁止额外提交 package-lock.json 或 yarn.lock。修改依赖使用 pnpm，不手工编辑锁文件。

## 4. 接口与数据开发

接口规范见 [契约维护说明](../../contracts/README.md)。后端请求校验失败返回 400，未认证返回 401，权限或 CSRF 不通过返回 403；前端不把失败展示成成功。Cookie 不进入 localStorage，会员及管理身份由后端判定。

新增业务接口必须校验账号状态和资源权限。当前框架通过 `UserService.requireActive` 统一查询账号状态，板块接口展示其调用方式；登录身份不自动意味着可以访问任意订单、会话或管理功能。禁止在整个 API 上关闭 CSRF；未来外部支付通知按其特定路径配置并独立验签。

新建迁移使用 `V3__描述.sql` 等版本名，合并前检查与 main 的版本冲突。已合并且被共享数据库执行过的脚本保持不变，变更新增迁移。开发身份使用单独目录下的可重复迁移，普通业务迁移不混入开发身份。测试不连接开发库或部署数据库。

## 5. 检查与报告

| 检查 | 命令与前置条件 |
| --- | --- |
| 后端单元测试 | backend 中 `./mvnw test`，无需 MySQL |
| 后端完整验证 | 测试数据库启动后，backend 中 `./mvnw verify`，包含 *IT 集成测试及打包 |
| 前端检查 | frontend 中 `pnpm format:check`、`pnpm api:check`、`pnpm typecheck`、`pnpm test`、`pnpm build` |
| 浏览器验收 | 开发数据库和后端 dev 服务运行；frontend 中安装 Playwright Chromium，再执行 `pnpm test:e2e`，测试自动启动 Vite |

后端测试报告位于 `backend/target/surefire-reports` 和 `failsafe-reports`，JaCoCo HTML 报告位于 `backend/target/site/jacoco/index.html`。覆盖率范围是当前 Java 实现，不能代表尚未实现的登录、私聊或支付模块已覆盖。浏览器报告位于 `frontend/playwright-report`；CI 上传这些报告。

CI 的三个检查名为 Frontend checks、Backend checks、Browser checks。首次推送工作流后，在 main 保护规则中将它们设为必需检查。保护规则、Reviewer 和 CODEOWNERS 的远端设置由仓库管理员维护；本次框架不替代实际人工评审记录。

## 6. 常见问题

- 端口占用：修改 Compose 的 MYSQL_PORT／TEST_MYSQL_PORT，及相应后端 DB_URL／TEST_DB_URL。前端 5173 被占用时会直接报错，避免测试悄悄访问另一个端口。
- pnpm 提示 Node 版本不符：切换到 .nvmrc 对应版本后再安装，不忽略 engines 检查。
- Docker Hub 下载失败：可使用 Docker 官方镜像的公开镜像源下载相同版本，再赋予本地 mysql:8.4.8 标签；不要更换成未经确认的第三方数据库镜像。
- Maven 使用了个人配置的内部镜像：检查自己的 settings.xml；可通过 Maven 的 -s／-gs 参数使用单独配置，不把个人镜像和凭据写入项目。
- 登录接口 403：通过 /auth/csrf 获取同一会话的 token，写请求携带对应 Cookie 与请求头；登录、退出后重新获取 token。
- 账号被限制：更换会话不会解除限制，应检查开发数据或授权的管理操作，不通过前端字段覆盖账号状态。
- 停止开发环境：在根目录执行 `docker compose --profile test stop`。保留开发数据卷；删除卷会丢失本地开发数据，不作为常规启动步骤。

## 7. AI 使用

本次框架由 OpenAI Codex 辅助生成和修改，涉及代码、测试、配置、页面与文档。构建、测试的实际执行结果记录在 [框架验证记录](bootstrap-validation.md)；成员应在 PR 中记录人工阅读、修改与运行检查，不将自动检查替代人的评审。
