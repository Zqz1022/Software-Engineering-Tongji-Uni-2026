# 同济大学校园论坛与站内私聊系统

同济大学 2026 年秋季软件工程课程项目，面向课程交流、项目组队和活动咨询，提供公开讨论、一对一文本私聊和 VIP 个性化服务。

## 项目成员

| 成员 | 团队角色 |
| --- | --- |
| 张启政 | 组长 |
| 刘笑云 | 组员 |
| 周禹佟 | 组员 |
| 李灏文 | 组员 |

## 项目章程概要

项目采用普通用户、VIP 用户、版主和管理员四类业务角色。QQ 或微信首次授权登录成功后自动创建普通账号，登录后即可浏览、发帖、评论及私聊；再次登录进入原账号。不设置游客账号，未登录仅为会话状态。VIP 提供金色昵称和主页装扮，版主与管理员依据本站授权承担社区治理职责。

外部集成包括 QQ 登录、微信登录、支付宝和微信支付。微信登录与微信支付分别处理，登录不产生会员权益。会员以服务端核验的支付结果为依据，同一订单只发放一次权益，续费按购买时长累加，到期后保留普通交流及独立管理权限。

开发采用增量模型，三个增量分别覆盖第三方登录与公开讨论、可靠私聊、会员充值与社区治理。每轮保留计划、构造、测试、评审和回顾记录，需求和实现通过 Issue、PR、CI 和 Release 关联。

## 项目文档

- [第一次课后至第二次课前的阶段调研报告](docs/design/tongji-campus-forum-research-plan.md)，现为 1.3 版，包含项目章程、四类业务角色、QQ／微信登录、VIP 充值、用户故事摘要与清单索引、技术风险和工程过程。
- [选题 Issue #1](https://github.com/Zqz1022/Software-Engineering-Tongji-Uni-2026/issues/1)。

报告采用公开资料分析与校园场景分析方法，由 OpenAI Codex 辅助整理，资料来源和 AI 使用范围列于正文。

<<<<<<< HEAD
## 开发约定

- [项目框架与协作开发约定](docs/development/project-bootstrap-and-collaboration.md)：记录 Vue 3／Spring Boot／MySQL 技术栈、工程目录、业务模块、Issue 与 PR 流程、CI、框架验收标准和三个增量安排。

## 本地开发

环境：Java 21、Node.js 22.23.1、pnpm 10.32.1、Docker Compose。后端使用仓库内的 Maven Wrapper，无须单独安装 Maven。项目自动使用独立 Maven 配置，依赖和插件统一从公共 Maven Central 下载，缓存在 backend/.cache/maven/repository，不读取个人或系统的 Maven settings.xml。

先准备前端工具。macOS／Linux 使用 nvm 时，在仓库根目录执行：

```sh
nvm install
nvm use
npm install --global pnpm@10.32.1 --registry=https://registry.npmjs.org/
node --version
pnpm --version
```

应分别显示 v22.23.1 和 10.32.1。Node 与 pnpm 按 nvm 的 Node 版本分别安装；每次新开前端终端先在仓库根目录执行 `nvm use`。未使用 nvm 的成员安装同版本 Node.js 后，再执行上述 npm 安装命令。pnpm 不随仓库或 npm 自动安装。

首次准备，在仓库根目录执行：

```sh
cp .env.example .env
docker compose --profile test up -d --wait db test-db
```

终端一启动后端：

```sh
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

终端二启动前端。使用 nvm 时，先在仓库根目录执行 `nvm use`，再执行：

```sh
cd frontend
pnpm install --frozen-lockfile
pnpm dev
```

不安装全局 pnpm 时，也可在 frontend 中分别用 `npx --yes --registry=https://registry.npmjs.org/ pnpm@10.32.1 install --frozen-lockfile` 和 `npx --yes --registry=https://registry.npmjs.org/ pnpm@10.32.1 dev` 启动，Node 版本要求相同。

访问 <http://127.0.0.1:5173>，选择开发用户一至四中的一个进入应用。顶部可以切换“广场／聊天／VIP”，右上角头像菜单提供“编辑账号”和“退出登录”。各功能主体展示开发中提示；刷新页面保持当前页面与会话，退出后受保护页面要求重新登录。四个账号均为普通开发身份，不对应具体组员，也不赋予 VIP 或管理权限。

框架已提供应用导航、登录态、板块接口联通和测试基础；QQ／微信真实登录、账号编辑、帖子评论、私聊、支付、装扮和治理按用户故事继续实现。板块接口保留供联调与测试使用，首页不再展示示例板块。开发登录只在 dev/test 中启用，部署配置关闭该入口。

- [开发与协作指南](docs/development/README.md)：版本安装、Windows 命令、模块认领、配置、测试和排错。
- [接口契约](contracts/openapi.yaml)及[接口维护说明](contracts/README.md)。
- [部署准备说明](deploy/README.md)：镜像构建、Nginx 与 HTTPS 接入边界。

## 本地检查与 CI

后端在测试数据库启动后执行：

```sh
cd backend
./mvnw verify
```

前端执行：

```sh
cd frontend
pnpm format:check
pnpm api:check
pnpm typecheck
pnpm test
pnpm build
```

后端开发服务运行时，在 frontend 中执行 `pnpm exec playwright install chromium` 和 `pnpm test:e2e`，验证登录、顶部导航、头像菜单、刷新与退出流程，同时通过带会话的请求验证板块接口联通。

[GitHub Actions](.github/workflows/ci.yml) 在 push／PR 时运行前端检查、后端单元及 MySQL 集成测试、浏览器验收，并保存测试报告。仓库设置中的 main 必需检查应包含 `Frontend checks`、`Backend checks`、`Browser checks`；工作流文件不会自动修改远端保护规则。
=======
## 需求规约与场景模型

- [用户故事清单 1.0](docs/requirements/user-stories.md)，按业务分组维护 US-01 至 US-28，包含 26 条功能故事、2 条非功能故事及 Given / When / Then 验收标准。
- [软件需求规格说明书（SRS）0.2](docs/requirements/software-requirements-specification.md)，包含 QQ／微信登录、四类业务角色、26 项功能需求、3 项非功能需求与验收条件。
- [用例与场景说明](docs/requirements/use-cases-and-scenarios.md)，包含完整用例目录，以及第三方登录、私聊消息、VIP 充值细化场景。
- [需求模型索引与图源](models/requirements/README.md)，提供用例图及 3 张活动图的 PlantUML 源文件和 SVG 预览。
>>>>>>> origin/main
