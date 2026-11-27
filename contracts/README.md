# 接口契约维护

[openapi.yaml](openapi.yaml) 是当前 HTTP 契约来源。前端的 src/api/schema.d.ts 由该文件生成，不手工维护。

在 frontend 中执行：

```sh
pnpm api:generate
pnpm api:check
```

生成前校验 OpenAPI 结构；检查命令比较契约生成结果与已提交类型。接口变更同时更新契约、前后端实现及验收测试，CI 会拒绝未同步的类型。

## 公共约定

- 路径前缀 /api/v1；成功返回资源对象或 items 列表，注销成功返回 204 无正文。
- 错误响应包含 code、message、status；使用 HTTP 状态码表达认证、授权、参数或服务错误。
- SESSION 为 HttpOnly 会话 Cookie。GET /auth/csrf 返回当前会话的请求头名称与 token，写请求同时回传 Cookie 和 token；生产会话 Cookie 只通过 HTTPS 发送。
- 接口时刻使用带时区的 ISO 8601；未来分页接口统一 page 从 1 开始、size 默认 20 且最大 100，响应包含 items、page、size、total，新增接口时写入具体 schema。
- GET /boards 当前返回有限的板块列表，不使用分页，也不提供帖子业务。
- POST /dev/session 仅在开发／测试启用，限定四个普通开发身份；不能用于外部集成验收。

## 后续模块

真实 QQ／微信登录、私聊、支付、VIP 和治理接口随各自 Issue 扩展。WebSocket 实现时在本目录新增事件契约，明确参与者鉴权、消息编号、客户端请求标识、确认、去重与重连补齐规则；框架阶段不发布可绕过鉴权的空 WebSocket 端点。
