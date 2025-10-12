# Claude Code Hooks 说明

## 🌍 跨平台支持

本插件的 hooks 完全支持 **Windows** 和 **Linux/Mac** 系统：

- ✅ **自动检测操作系统**
- ✅ **智能路径转换**
  - Windows: `%USERPROFILE%\.claude\plugins\...`
  - Linux/Mac: `~/.claude/plugins/...`
- ✅ **统一的配置文件** (`hooks.json`)

## ⚠️ 重要说明

### 为什么 Hooks 不会自动生效？

Claude Code 插件系统中的 **hooks 不会自动启用**，这是出于安全考虑：

1. **`plugin.json` 中的 `components.hooks`**
   - 仅声明插件包含哪些 hook 脚本文件
   - 不会自动注册或启用它们

2. **`hooks.json` 的作用**
   - 📄 提供配置文档和模板
   - 📋 说明插件提供了哪些 hooks
   - ❌ **不会被 Claude Code 自动读取**

3. **为什么要手动配置？**
   - 🔒 Hooks 会执行系统命令，有安全风险
   - 🔒 用户应该明确知道并授权
   - 🔒 防止恶意插件自动执行代码

## 📦 包含的 Hooks

### 1. 用户消息记录 Hook
- **事件**: `UserPromptSubmit`
- **功能**: 自动记录每次对话的用户消息到 `~/.claude/session-messages.json`
- **脚本**: `record-messages.js`
- **默认状态**: ✅ 启用

### 2. AI 回复完成提示音 Hook
- **事件**: `Stop`
- **功能**: AI 回复完成后播放提示音
- **脚本**: `play-mp3.ps1`
- **默认状态**: ❌ 禁用（可选功能）

## 🚀 安装方法

### 方法 1：自动安装（推荐）⭐

#### 基础安装

运行自动安装脚本（**跨平台通用**）：

```bash
# 增量模式（默认）- 只添加新的 hooks
node ~/.claude/plugins/marketplaces/cc-plugin-marketplace/hooks/install-hooks.js

# 同步模式 - 完全同步 hooks.json（添加/更新/删除）
node ~/.claude/plugins/marketplaces/cc-plugin-marketplace/hooks/install-hooks.js --sync

# 强制模式 - 重置所有插件 hooks
node ~/.claude/plugins/marketplaces/cc-plugin-marketplace/hooks/install-hooks.js --force

# 查看帮助
node ~/.claude/plugins/marketplaces/cc-plugin-marketplace/hooks/install-hooks.js --help
```

#### 🎯 运行模式说明

| 模式 | 命令 | 适用场景 | 幂等性 |
|------|------|----------|--------|
| **增量** | `node install-hooks.js` | 首次安装、添加新 hooks | ✅ |
| **同步** | `node install-hooks.js --sync` | 启用/禁用 hooks、删除某个 hook | ✅ |
| **强制** | `node install-hooks.js --force` | 配置出错、需要重置 | ✅ |

**详细场景指南**: 查看 [USAGE_SCENARIOS.md](./USAGE_SCENARIOS.md)

#### 脚本特性

- ✅ **自动检测操作系统**（Windows / Linux / Mac）
- ✅ **智能路径转换**（根据系统生成正确路径格式）
- ✅ **三种运行模式**（增量/同步/强制）
- ✅ **幂等性保证**（可重复运行）
- ✅ 自动备份 `settings.json`
- ✅ 智能合并配置
- ✅ 显示详细的转换过程和结果

#### 测试工具

**测试路径转换**（不修改配置）：
```bash
node ~/.claude/plugins/marketplaces/cc-plugin-marketplace/hooks/test-install.js
```

### 方法 2：手动安装

编辑 `~/.claude/settings.json`，在 `hooks` 部分添加：

#### Windows 系统：
```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"%USERPROFILE%\\.claude\\plugins\\marketplaces\\cc-plugin-marketplace\\hooks\\record-messages.js\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "powershell -WindowStyle Hidden -File \"%USERPROFILE%\\.claude\\plugins\\marketplaces\\cc-plugin-marketplace\\hooks\\play-mp3.ps1\""
          }
        ]
      }
    ]
  }
}
```

#### Linux/Mac 系统：
```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"~/.claude/plugins/marketplaces/cc-plugin-marketplace/hooks/record-messages.js\""
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash \"~/.claude/plugins/marketplaces/cc-plugin-marketplace/hooks/play-mp3.sh\""
          }
        ]
      }
    ]
  }
}
```

**注意**：
- `Stop` hook（提示音）可选，不需要可以删除
- Linux/Mac 系统的 `play-mp3.sh` 需要自行实现音频播放功能

## ✅ 验证安装

1. **重启 Claude Code**（hooks 配置需要重启后生效）

2. **发送测试消息**

3. **检查记录文件**：
   ```bash
   cat ~/.claude/session-messages.json
   ```

   应该能看到类似内容：
   ```json
   {
     "sessionMsgs": {
       "session-abc123": {
         "path": "C:\\your\\workspace",
         "date": "2025-10-12",
         "210530": "你的测试消息",
         "_createdAt": 1728738330000
       }
     }
   }
   ```

## 📐 路径格式说明

### 跨平台路径差异

| 系统 | 环境变量 | 路径分隔符 | 示例 |
|------|----------|------------|------|
| **Windows** | `%USERPROFILE%` | `\` (反斜杠) | `%USERPROFILE%\.claude\plugins\...` |
| **Linux/Mac** | `~` | `/` (正斜杠) | `~/.claude/plugins/...` |

### 路径转换示例

**插件配置** (`hooks.json`)：
```json
{
  "command": "node \"{{pluginDir}}/hooks/record-messages.js\""
}
```

**自动转换结果**：
- Windows: `node "%USERPROFILE%\.claude\plugins\marketplaces\cc-plugin-marketplace\hooks\record-messages.js"`
- Linux/Mac: `node "~/.claude/plugins/marketplaces/cc-plugin-marketplace/hooks/record-messages.js"`

### 为什么使用相对路径？

- ✅ **可移植性**: 配置可以在不同系统间共享
- ✅ **兼容性**: 支持多用户环境
- ✅ **灵活性**: 用户目录位置改变时无需修改配置

## 🔧 配置说明

### 修改 hooks.json

如果想要修改默认配置，编辑 `hooks.json`：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "name": "record-user-messages",
        "description": "记录用户消息",
        "type": "command",
        "command": "node \"{{pluginDir}}/hooks/record-messages.js\"",
        "enabled": true  // ← 改为 false 可以在自动安装时跳过
      }
    ]
  }
}
```

**变量说明**：
- `{{pluginDir}}`: 插件目录路径
- `{{userHome}}`: 用户主目录

## 🎯 设计问题与改进建议

### 当前的问题

❌ **用户体验不佳**：
- 插件提供了完整的 hooks 配置
- 但用户仍需手动复制到 settings.json
- hooks.json 变成了"说明文档"

✅ **理想的流程应该是**：
1. 安装插件时弹出授权提示
2. 用户确认后自动配置
3. 可以随时在设置中修改

### 临时解决方案

使用本目录的 `install-hooks.js` 自动安装脚本，可以：
- 📦 一键安装所有 hooks
- 💾 自动备份原配置
- ✅ 智能跳过已存在的配置
- 🔒 遵循 `enabled` 设置

## 📝 卸载

如果需要移除这些 hooks：

1. **手动方式**：
   - 编辑 `~/.claude/settings.json`
   - 删除对应的 hook 配置
   - 重启 Claude Code

2. **从备份恢复**：
   ```bash
   # 查找备份文件
   ls ~/.claude/settings.json.backup.*

   # 恢复
   cp ~/.claude/settings.json.backup.XXXXXX ~/.claude/settings.json
   ```

## 🐛 故障排查

### Hook 没有执行？

1. **检查配置格式**：
   ```bash
   cat ~/.claude/settings.json
   ```
   确保 hooks 配置格式正确（必须有嵌套的 `"hooks": []`）

2. **检查脚本路径**：
   ```bash
   ls ~/.claude/plugins/marketplaces/cc-plugin-marketplace/hooks/
   ```
   确保 `record-messages.js` 和 `play-mp3.ps1` 存在

3. **启用调试日志**：
   编辑 `record-messages.js`，设置：
   ```javascript
   enableDebugLog: true
   ```
   然后查看日志：
   ```bash
   cat ~/.claude/logs/record-messages.log
   ```

4. **重启 Claude Code**：
   Hooks 配置修改后必须重启才能生效

## 📚 更多信息

- [Claude Code 文档](https://docs.claude.com/claude-code)
- [插件开发指南](https://github.com/Bozhu12/bozhu12-cc-plugin)
