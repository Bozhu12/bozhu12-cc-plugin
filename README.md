# Claude Code Plugin - Bozhu12 个人助手

> 一个功能完整的 Claude Code 插件，提供自动化 Hooks、自定义命令、AI 代理和输出样式

**版本**: v1.1.0 | **作者**: Bozhu12 | **许可**: MIT

---

## 🚀 快速开始

```bash
/plugin marketplace add Bozhu12/bozhu12-cc-plugin
```

## 📦 其他插件组件

### Commands（自定义命令）

插件提供以下 slash 命令：

| 命令 | 说明 |
|------|------|
| `/think` | 智能思考分析（支持 `--1`, `--2`, `--3` 三级深度）|
| `/analyze` | 项目结构分析 |
| `/codex` | Codex 风格代码审查 |
| `/doc` | 自动生成文档 |
| `/git-analyze` | Git 仓库分析 |
| `/me/execute` | 自定义执行命令 |
| `/me/route` | 路由分析 |

使用方式：直接在 Claude Code 输入框输入命令即可

### AI Agents（智能代理）

插件包含 25+ 个专业 AI 代理，按类别组织：

**Core（核心）**: code-archaeologist, documentation-specialist, performance-optimizer, refactoring-expert, security-guardian

**Frontend（前端）**:
- React: react-component-architect, react-nextjs-expert
- Vue: vue-component-architect, vue-nuxt-expert, vue-state-manager
- 通用: frontend-developer, api-architect, tailwind-css-expert

**Orchestrators（编排）**: tech-lead-orchestrator, team-configurator, project-analyst

**Me（自定义）**: api-h5-tester, blog-markdown-extender, code-reviewer, document-translator, markdown-syntax-formatter, project-deep-analyzer

使用方式：在对话中直接请求，如 "用 vue-nuxt-expert 帮我实现 SSR 页面"

### MCP Servers

- **context7.json** - Context7 MCP 服务器集成

### Output Styles（输出样式）

- **codex.md** - 专业技术分析风格
- **linus-torvalds.md** - 严谨的代码审查风格

> 自行将文档添加到 .claude/output-styles目录下

### 🔩 Hooks 使用说明（需手动引入）

> 由于官方的安全策略，插件内置的 Hook 不会被自动启用。请您在本地“手动引入并审阅”后再使用。本插件已提供完整的 Hook 配置与脚本，遵循下述步骤即可快速启用。

#### 环境变量（用于可选通知）

若启用 `Stop` 事件中的通知：

- 企业微信机器人：设置 `QYWX_WEBHOOK_KEY`。
- Gotify：设置 `token`（服务端 Token）。

设置示例：

- Windows PowerShell：`$env:QYWX_WEBHOOK_KEY = "xxxx"`
- macOS/Linux：`export QYWX_WEBHOOK_KEY=xxxx`

#### 数据写入与验证

- 默认写入位置：
  - Windows：`%USERPROFILE%\.claude\session-messages.json`
  - macOS/Linux：`~/.claude/session-messages.json`
- 结构示例：
  `{ "sessionMsgs": { "<sessionId>": { "path": "...", "date": "YYYY-MM-DD", "HHmmss": "消息" } } }`
- 验证：在 Claude Code 中发送一条消息后，检查上述 JSON 是否新增条目。

如需排查：可将 `record-messages.js` 中 `enableDebugLog` 设为 `true`，日志输出在 `~/.claude/logs/record-messages.log`。

#### 安全提示

- Hook 会在本机执行命令/脚本，请仅启用您信任的条目。
- 导入前务必审阅 `hooks.json` 与相关脚本；不需要的事件（如通知）请删除或禁用。

#### 绝对路径示例

Windows：

```
node \"%USERPROFILE%\\.claude\\cc-aicodemirror-statusline-plus\\refresh-credits.js
```

macOS/Linux：

```
node ~/.claude/cc-aicodemirror-statusline-plus/refresh-credits.js
```

## 📁 插件目录结构

```
cc-plugin/
├── .claude-plugin/
│   └── plugin.json              # 插件配置（必需）
├── agents/                      # AI 代理定义
│   ├── core/
│   ├── frontend/
│   ├── orchestrators/
│   └── me/
├── commands/                    # Slash 命令定义
│   └── me/
├── hooks/                       # Hook 脚本（本插件核心）
│   ├── hooks.json              # Hook 配置文件
│   └── record-messages.js      # 消息记录脚本
├── mcp-servers/                 # MCP 服务器配置
├── output-styles/               # 输出样式定义
└── README.md                    # 本文档
```

## 🤝 贡献

欢迎提交 Issue 和 PR！

---

## 📄 许可证

MIT License - 自由使用、修改和分发

---

## 👤 作者

**Bozhu12**

- Email: Bozhu12@foxmail.com
- GitHub: [@Bozhu12](https://github.com/Bozhu12)

**为 Claude Code 开发者打造，专注于提升开发效率** 🚀
