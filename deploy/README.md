# 部署准备

本目录提供前后端镜像构建、Nginx 反向代理和 prod 配置的 Compose 模板。开发联调使用仓库根目录的 Compose 与 dev 启动方式。

## 构建与启动

在仓库根目录执行；先在 deploy/.env 中填入部署数据库凭据：

```sh
cp deploy/.env.example deploy/.env
docker compose --env-file deploy/.env -f deploy/compose.yaml build
docker compose --env-file deploy/.env -f deploy/compose.yaml up -d
```

Compose 的相对构建路径基于 deploy 目录；两个 Dockerfile 使用仓库根目录作为构建上下文。后端镜像打包时跳过测试，发布前必须先通过 CI 的构建、单元、MySQL 集成和浏览器检查。

Nginx 默认只监听本机 8088，由服务器上的 HTTPS 入口转发到该端口。它提供前端页面并代理 /api；数据库和后端不直接暴露宿主机端口。prod 使用 Secure 会话 Cookie，正式登录需要 HTTPS，不能为了 HTTP 演示关闭该属性。

## 环境边界

- 部署只使用 prod 配置，不加载开发账号；开发登录显式关闭，混合启用 dev/test 会拒绝启动。
- 当前交付为工程框架，prod 页面不提供模拟登录。QQ／微信、支付的应用资质、真实配置和回调能力随业务 Issue 接入。
- 外部域名、HTTPS 证书、运行服务器、部署凭据和上线决定在发布任务中记录。当前 CI 负责验证与保存构建产物；自动发布到实际服务器的步骤在部署目标明确后接入，不把本地镜像构建声明为已上线。
- 数据库凭据通过环境变量注入；dev 与 prod 使用不同数据库和数据卷。迁移由后端启动时的 Flyway 执行。
- 框架模板使用 MySQL 8.4.8、Node 22.23.1 和 Java 21 系列镜像；部署运行镜像升级需记录版本，正式发布记录解析后的镜像 digest。
