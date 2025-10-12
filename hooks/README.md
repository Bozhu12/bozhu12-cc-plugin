# Claude Code Hooks 使用指南

本插件提供了 2 个实用的 Hooks，用于增强 Claude Code 的使用体验。

## 配置机制说明

### 为什么需要手动安装？

Claude Code 采用**显式配置机制**来保障安全性和用户控制：

1. **插件提供**：`hooks.json` 定义可用的 Hooks 配置
2. **用户安装**：通过 `install-hooks.js` 将配置写入 `~/.claude/settings.json`
3. **Claude 加载**：Claude Code 从 `settings.json` 读取并执行 Hooks

这种设计避免了插件自动执行命令的安全风险，让用户完全掌控哪些 Hooks 可以运行。

## 快速开始

### 安装 Hooks

在插件目录下执行：

```bash
node hooks/install-hooks.js
```

**特性**：
- ✅ 跨平台支持（Windows/Linux/macOS）
- ✅ 幂等性：重复执行不会重复添加
- ✅ 自动备份 `settings.json`
- ✅ 智能路径处理

### 卸载 Hooks

手动编辑 `~/.claude/settings.json`，删除对应的 hooks 配置项。

## 可用 Hooks

### 1. 用户消息记录 (UserPromptSubmit)

**功能**：自动记录用户发送的消息到 `~/.claude/session-messages.json`

**输出格式**：
```json
{
  "sessionMsgs": {
    "session-id": {
      "path": "/workspace/path",
      "date": "2025-10-12",
      "220123": "用户消息内容 1",
      "220456": "用户消息内容 2"
    }
  }
}
```

**配置项**：
- `timeFormat`: 时间格式 `HHmmss` 或 `HHmm`
- `skipCommands`: 跳过的命令，如 `['/clear']`
- `enableDebugLog`: 调试日志开关

修改 `record-messages.js` 的 `CONFIG` 对象来调整配置。

### 2. 企业微信通知 (Stop)

**功能**：AI 回复完成后发送企业微信通知

**配置要求**：
- 需要配置企业微信群机器人 webhook 地址
- 修改 `hooks.json` 中的 webhook key 为你的机器人 key

## 禁用 Hooks

如需禁用某个 Hook，编辑 `~/.claude/settings.json`，删除对应的 hooks 配置项，然后重启 Claude Code。

## 自定义 Hooks

### 1. 编辑 hooks.json

```json
{
  "hooks": {
    "EventName": [
      {
        "name": "my-custom-hook",
        "description": "Hook 描述",
        "type": "command",
        "command": "node \"{{pluginDir}}/hooks/my-script.js\""
      }
    ]
  }
}
```

**支持的事件**：参考 [Claude Code Hooks 文档](https://docs.claude.com/en/docs/claude-code/hooks)

**模板变量**：
- `{{pluginDir}}`: 插件目录的绝对路径（安装时会转换为平台路径变量）

### 2. 编写脚本

在 `hooks/` 目录下创建你的脚本文件。

**提示**：
- Hook 输入通过 `stdin` 传入（JSON 格式）
- 使用 `fs.readFileSync(0, 'utf-8')` 读取输入
- 参考 `record-messages.js` 的实现

### 3. 安装

```bash
node hooks/install-hooks.js
```

## 常见问题

### Q: 为什么 Hooks 没有生效？

A: 确保已重启 Claude Code。修改 `settings.json` 后需要重启才能生效。

### Q: 如何查看 Hooks 的执行日志？

A:
- 用户消息记录：启用 `CONFIG.enableDebugLog` 查看 `~/.claude/logs/record-messages.log`
- 其他 Hooks：自行添加日志代码

### Q: 跨平台路径问题如何处理？

A: `install-hooks.js` 会自动处理：
- Windows: 使用 `%USERPROFILE%` 和反斜杠 `\`
- Linux/macOS: 使用 `$HOME` 和正斜杠 `/`

### Q: 重复执行 install-hooks.js 会重复添加吗？

A: 不会。脚本具有幂等性，会自动检测并跳过已存在的 Hooks。

## 参考资料

- [Claude Code Hooks 官方文档](https://docs.claude.com/en/docs/claude-code/hooks)
- [插件开发指南](../README.md)
