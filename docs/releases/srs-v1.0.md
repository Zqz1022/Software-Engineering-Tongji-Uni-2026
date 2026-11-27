# SRS v1.0 — 校园论坛与站内私聊系统需求基线

本版将需求评审稿整理为后续分析建模、设计、实现和验收使用的 SRS 1.0 基线，按第 3 次课要求以 `srs-v1.0` 标签发布，并附变更记录。此版本号用于需求文档，软件增量另按 `v0.1`、`v0.2`、`v0.3` 发布。

## 三块结构

| 结构 | 位置 | 内容 |
| --- | --- | --- |
| 功能需求 | SRS 第 4 节 | FR-01 至 FR-26，每项含 UC 编号、行为描述和 Given / When / Then 验收标准 |
| 非功能需求 | SRS 第 5 节 | NFR-01 至 NFR-03 及 NFC-01 至 NFC-03，覆盖安全、性能与可靠性、可用性及故障反馈 |
| 约束条件 | SRS 第 8.1 节 | CON-01 至 CON-08，规定范围、接入、部署、技术、隐私、数据及交付边界与核对方式 |

## 相对 0.2 的变化

- 增加三块结构索引，将散布的既定边界整理为 8 项编号约束，并与已选 Vue 3／Spring Boot／MySQL 框架保持一致。
- 澄清 FR-14／UC-14：双方全部有效拉黑关系解除且符合账号与会话权限条件后，才恢复发送。
- 保留 26 项功能需求、3 项非功能需求及全部 US／FR／UC 编号，继续采用 QQ／微信登录、四类业务角色和支付宝／微信支付 VIP 充值方案。
- 更新基线版本、配套模型索引与用例说明，补充独立 SRS 变更记录，明确通过 Issue＋PR 管理后续需求变化。

## 本版材料

以下链接固定到本次发布标签，后续 main 的修改不会改变本版内容。

- [软件需求规格说明书 SRS 1.0](https://github.com/Zqz1022/Software-Engineering-Tongji-Uni-2026/blob/srs-v1.0/docs/requirements/software-requirements-specification.md)
- [SRS 变更记录](https://github.com/Zqz1022/Software-Engineering-Tongji-Uni-2026/blob/srs-v1.0/docs/requirements/CHANGELOG.md)
- [用户故事清单：US-01 至 US-28](https://github.com/Zqz1022/Software-Engineering-Tongji-Uni-2026/blob/srs-v1.0/docs/requirements/user-stories.md)
- [用例与场景说明：26 个功能用例、3 个细化用例](https://github.com/Zqz1022/Software-Engineering-Tongji-Uni-2026/blob/srs-v1.0/docs/requirements/use-cases-and-scenarios.md)
- [用例图与 3 张活动图：PlantUML 源文件及 SVG](https://github.com/Zqz1022/Software-Engineering-Tongji-Uni-2026/tree/srs-v1.0/models/requirements)
- [阶段调研报告：业务与来源依据](https://github.com/Zqz1022/Software-Engineering-Tongji-Uni-2026/blob/srs-v1.0/docs/design/tongji-campus-forum-research-plan.md)

## 下载与追溯

附件 `srs-v1.0-docs.zip` 保留上述文档及图源的仓库目录结构，解压后从 `docs/requirements/software-requirements-specification.md` 开始阅读；相对链接和图片引用保持有效。另附 `srs-v1.0-CHANGELOG.md`、`SOURCE_COMMIT.txt` 和 `SHA256SUMS`，分别用于查阅变更、定位完整提交及校验附件。

需求基线后的调整应关联变更 Issue，经 PR 评审同步修订 SRS、场景、模型和验收条件，另发新版本，不覆盖 `srs-v1.0`。

本版由 OpenAI Codex 辅助整理需求、约束、变更记录和发布配置；人工评审、需求确认及合并决定以对应 PR 与课程评审记录为依据。
