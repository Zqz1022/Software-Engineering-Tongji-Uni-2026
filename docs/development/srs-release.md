# SRS 1.0 发布操作

本说明用于将第 3 次课后的需求材料发布为 GitHub Release。课程依据为《第03课-学生讲解项目需求》第 1 页：“SRS v1.0 以 Release 发布（含变更记录）”。课堂评审与 PR 人工评审记录按实际结果保留。

## 1. 本次发布内容

- 工作分支：`docs/srs-v1.0-release`，从 `main` 的 `c4fa886` 创建。
- 发布标签：`srs-v1.0`。
- 发布标题：`SRS v1.0 — 校园论坛与站内私聊系统需求基线`。
- [SRS 正文](../requirements/software-requirements-specification.md)：第 4、5、8.1 节分别为功能需求、非功能需求、约束条件。
- [SRS 变更记录](../requirements/CHANGELOG.md)与[Release 正文](../releases/srs-v1.0.md)。
- [发布工作流](../../.github/workflows/srs-release.yml)：仅由人工在 main 上触发，使用该次运行的确定提交打包、创建标签和发布。

SRS 1.0 的文档日期为 2026-11-27；GitHub 显示的发布时间以实际执行为准。用户故事清单保留其独立的 1.0 版本和原编号。此次文档基线不改变软件增量 v0.1／v0.2／v0.3 的版本安排。

## 2. 合并与发布

1. 提交并推送本分支，在 GitHub 创建面向 `main` 的 PR。评审重点为三块结构、业务一致性、约束条件及变更记录；按仓库约定由非作者成员评审，必需 CI 检查通过后合并。
2. PR 合并后，打开仓库 **Actions → Publish SRS v1.0 → Run workflow**，分支选择 **main**。工作流随 PR 合并进入默认分支后才会出现在可运行列表中。
3. 工作流使用仓库提供的 `GITHUB_TOKEN` 及作业级 `contents: write` 权限，无须配置个人访问令牌。它先检查版本和标签，再打包该次运行的提交，上传全部附件到 Draft，最后公开发布。
4. 打开 **Releases → SRS v1.0**，确认标签为 `srs-v1.0`，不是 Draft 或 Pre-release，变更说明完整，且四个附件可下载。运行摘要也会提供 Release 链接。
5. 将该 Release 链接作为本项课程交付入口。需求追溯矩阵 v0、独立需求变更通道以及第 4 次课前分析模型按后续任务完成；发布本项不表示其他阶段任务已经完成。

工作流不会推送 main、创建 PR 或自动合并 PR，也不会发布软件部署版本。`srs-v1.0` 不设为软件的 Latest Release。

## 3. 附件与核对

| 附件 | 内容 |
| --- | --- |
| `srs-v1.0-docs.zip` | SRS、独立变更记录、28 条用户故事、用例与场景说明、需求模型图源与 SVG、来源调研报告、Release 说明；保留相对目录结构 |
| `srs-v1.0-CHANGELOG.md` | 可单独查看的 SRS 变更记录，与 ZIP 中的 CHANGELOG.md 相同 |
| `SOURCE_COMMIT.txt` | 打包并作为发布目标的完整提交 SHA |
| `SHA256SUMS` | 上述三个附件的 SHA-256 校验值 |

在同一目录下载四个附件后，macOS 使用 `shasum -a 256 -c SHA256SUMS`，Linux 使用 `sha256sum -c SHA256SUMS`。解压 ZIP，从 `campus-forum-srs-v1.0/docs/requirements/software-requirements-specification.md` 阅读，检查用例图及内部文档链接。

GitHub 自动附带的 Source code ZIP／tar.gz 是该标签的完整仓库快照；`srs-v1.0-docs.zip` 是供本次交付阅读的文档包。

## 4. 发布失败时

- 若手动选择了其他分支，工作流会在创建标签前失败；选择 main 重新运行。
- 若仓库或组织策略禁止 `GITHUB_TOKEN` 写入，运行会报告权限错误。由仓库管理员核对 Actions 权限；也可在 GitHub Releases 界面按上述标签、确定提交及 Release 正文手动发布，并从该提交准备相同附件。
- 若标签已经存在，工作流拒绝覆盖。先检查对应 Release：已公开发布的版本保持不变；若上传中断留下 Draft，应核对其目标提交，补齐四个附件并验证校验值后再手动发布。不要把附件来自不同提交的 Draft 直接公开。
- 若出现已有 Draft 但标签尚未创建的情况，重复运行也可能因同名 Draft 失败；同样先检查并完成原 Draft。

后续需求变化建立 Issue，通过 PR 修订 SRS、配套材料及变更记录，另发新的 SRS 版本；不移动或覆盖 `srs-v1.0`。
