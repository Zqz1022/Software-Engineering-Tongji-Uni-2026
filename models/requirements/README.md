# 需求阶段模型

本目录与 [SRS 0.1](../../docs/requirements/software-requirements-specification.md)及[用例与场景说明](../../docs/requirements/use-cases-and-scenarios.md)配套，作为第 3 次课课前需求评审材料。

| 模型 | 覆盖内容 | 可编辑源文件 | 预览 |
| --- | --- | --- | --- |
| 系统用例图 | UC-01 至 UC-26；五类用户及三个外部系统 | [use-cases.puml](use-cases.puml) | [SVG](use-cases.svg) |
| 身份关联活动图 | UC-19：校方认证、结果核验、唯一关联及失败处理 | [activity-identity.puml](activity-identity.puml) | [SVG](activity-identity.svg) |
| 文本消息活动图 | UC-12，关联 UC-10、UC-18：权限、保存、确认、投递与重试 | [activity-messaging.puml](activity-messaging.puml) | [SVG](activity-messaging.svg) |
| VIP 充值活动图 | UC-21、UC-22，关联 UC-20、UC-25、UC-26：双渠道支付及一次性发放 | [activity-vip-payment.puml](activity-vip-payment.puml) | [SVG](activity-vip-payment.svg) |

图源为 PlantUML，SVG 由图源生成。源文件中的 UC 编号与 SRS、场景目录一致。字体采用 PingFang SC；在其他系统中可改为可用的中文字体后重新生成，保证中文字符完整显示。

使用 PlantUML 1.2025.10 和 Graphviz，在仓库根目录执行：

```sh
plantuml -charset UTF-8 -failfast2 -tsvg models/requirements/*.puml
```

修改图源后应同步更新对应 SVG，保留源文件与预览的一致性。各图及其预览作为同一模型变更评审。

图源由 OpenAI Codex 辅助生成，模型的业务含义、需求确认及合并放行由人工评审把关。
