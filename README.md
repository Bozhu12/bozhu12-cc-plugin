# Claude Code Plugin - Bozhu12 个人助手

> 一个功能完整的 Claude Code 插件，提供自动化 Hooks、自定义命令、AI 代理和输出样式

**版本**: v1.1.0 | **作者**: Bozhu12 | **许可**: MIT

---

## 🚀 快速开始

```bash
/plugin marketplace add Bozhu12/bozhu12-cc-plugin
```

## 🔗 核心功能：Hooks 自动化

### 1. 用户消息记录（重点功能）

**自动记录所有用户消息到结构化 JSON 文件**

#### 工作原理

- **触发事件**: `UserPromptSubmit` - 用户提交消息时立即触发
- **数据来源**: 从 Claude Code 的 hook stdin 读取消息内容
- **输出文件**: `~/.claude/session-messages.json`
- **时间精度**: HHmmss（精确到秒，如 `170442` = 17:04:42）

#### 数据格式

```json
{
  "sessionMsgs": {
    "会话ID": {
      "path": "工作区路径",
      "date": "2025-10-12",
      "170442": "用户消息内容 1",
      "170709": "用户消息内容 2",
      "170911_1": "同秒第二条消息"
    }
  }
}
```

#### 配置 Hook

文件位置：`hooks/hooks.json`

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "name": "record-user-messages",
        "description": "记录用户消息",
        "type": "command",
        "command": "node \"{{pluginDir}}/hooks/record-messages.js\"",
        "enabled": true
      }
    ]
  }
}
```

#### 自定义配置

编辑 `hooks/record-messages.js` 顶部配置：

```javascript
const CONFIG = {
  outputFile: 'session-messages.json',  // 输出文件名
  timeFormat: 'HHmmss',                 // 时间格式：HHmm 或 HHmmss
  skipCommands: ['/clear'],             // 跳过的命令列表
  enableDebugLog: false                 // 启用调试日志
};
```

#### 查看记录

```bash
# 查看所有会话
cat ~/.claude/session-messages.json | jq '.sessionMsgs | keys'

# 查看当前会话的最新消息
cat ~/.claude/session-messages.json | jq '.sessionMsgs | to_entries | last'

# 统计总消息数
cat ~/.claude/session-messages.json | jq '[.sessionMsgs[] | to_entries[] | select(.key | startswith("_") | not)] | length'
```

#### 调试日志

设置 `enableDebugLog: true` 后，日志输出到：
```
~/.claude/logs/record-messages.log
```

---

### 2. AI 回复音频提醒（可选）

AI 回复完成后播放提示音，提升使用体验。

```json
{
  "name": "play-notification-sound",
  "enabled": false,  // 默认禁用，需要时改为 true
  "command": "powershell -WindowStyle Hidden -File \"{{pluginDir}}/hooks/play-mp3.ps1\""
}
```

---

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

---

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

---

### Output Styles（输出样式）

- **codex.md** - 专业技术分析风格
- **linus-torvalds.md** - 严谨的代码审查风格

---

### MCP Servers

- **context7.json** - Context7 MCP 服务器集成

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
│   ├── record-messages.js      # 消息记录脚本
│   ├── README.md               # Hook 详细文档
│   ├── play-mp3.ps1            # 音频播放脚本
│   └── ok.mp3                  # 提示音文件
├── mcp-servers/                 # MCP 服务器配置
├── output-styles/               # 输出样式定义
└── README.md                    # 本文档
```

## 📝 更新日志

### v1.1.0 (2025-10-12)
- ✨ 新增用户消息记录 Hook（核心功能）
- ✨ 支持 UserPromptSubmit 事件
- ✨ 秒级时间精度（HHmmss）
- 🔧 添加 hooks.json 配置管理
- 📝 完善插件文档

### v1.0.0
- 🎉 初始版本
- 📦 集成命令、代理、输出样式

---

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
