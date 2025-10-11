---
argument-hint: "<内容描述>"
---

# Codex 提问

## 概述
通过 Claude Code 调用 codex 命令进行非交互式提问，获取针对特定上下文和问题的结论。

**重要前置步骤**：在使用 codex 命令之前，**必须**先使用 `sequential-thinking` MCP 工具拆解用户问题，分析问题结构，然后基于拆解结果构建 JSON 消息。

## 工作流程

1. **问题拆解**（必需）：使用 `sequential-thinking` MCP 工具分析用户问题
2. **信息整理**：根据拆解结果组织上下文和问题细节
3. **构建 JSON**：将整理好的信息转换为 JSON 格式
4. **执行 codex**：调用 codex 命令获取结论

## 命令格式
```bash
codex e --skip-git-repo-check '{json_msg}'
```

## 使用方式

### 1. 完整工作流示例

**第一步：使用 sequential-thinking 拆解问题**

当用户提出问题时，首先使用 `sequential-thinking` MCP 工具进行分析：

```
用户问题: "我的 React 应用列表组件在数据量大时很慢，怎么优化？"

使用 sequential-thinking 拆解后得到：
- 核心问题：React 列表组件性能问题
- 问题场景：数据量大时渲染缓慢
- 需要分析：可能的优化方案
- 技术栈：React
- 目标：提升渲染性能
```

**第二步：基于拆解结果构建 JSON 并执行 codex**

```bash
codex e --skip-git-repo-check '{"context":"正在开发一个 React 应用","problem":"组件渲染性能问题","details":"列表组件在数据量大时渲染缓慢","goal":"分析可能的优化方案"}'
```

### 2. 基本用法
将上下文、现状和问题主题整理成 JSON 格式的消息，传递给 codex：

```bash
codex e --skip-git-repo-check '{"context":"正在开发一个 React 应用","problem":"组件渲染性能问题","details":"列表组件在数据量大时渲染缓慢","goal":"分析可能的优化方案"}'
```

### 2. JSON 消息结构
建议使用以下 JSON 结构组织信息：

```json
{
  "context": "项目背景、技术栈、相关配置",
  "current_status": "当前代码状态、已实现功能",
  "problem": "具体要解决的问题或需要的建议",
  "goal": "期望达成的结果",
  "constraints": "限制条件或特殊要求",
  "priority": "优先级（high/medium/low）"
}
```

### 3. 实际使用示例

#### 代码审查场景
```bash
codex e --skip-git-repo-check -s read-only '{"context":"Node.js API 项目，使用 Express 框架","current_status":"新增了用户认证模块，包含 JWT token 处理","problem":"需要对认证代码进行安全性审查","goal":"确保没有安全漏洞","priority":"high"}'
```

#### 架构设计场景
```bash
codex e --skip-git-repo-check -s read-only '{"context":"微服务架构，多个服务间需要通信","current_status":"目前使用 REST API，但有实时性要求","problem":"考虑引入消息队列或 WebSocket","goal":"选择最适合的通信方案","constraints":"高并发、低延迟"}'
```

#### 性能优化场景
```bash
codex e --skip-git-repo-check -s read-only '{"context":"Vue.js 前端应用，数据量较大","current_status":"页面加载时间超过 3 秒","problem":"首屏加载性能问题","goal":"将加载时间降低到 1 秒以内","priority":"high"}'
```

#### 错误排查场景
```bash
codex e --skip-git-repo-check -s read-only '{"context":"Python Django 项目，部署在生产环境","current_status":"间歇性出现 500 错误","problem":"错误日志显示数据库连接超时","goal":"找到根本原因和解决方案","priority":"high"}'
```

#### 功能开发场景
```bash
codex e --skip-git-repo-check -s read-only '{"context":"React Native 移动应用","current_status":"基础框架已搭建完成","problem":"需要实现离线数据同步功能","goal":"设计合适的离线存储和同步策略","constraints":"支持 iOS 和 Android"}'
```

## 最佳实践

### 0. 问题拆解（必需）
- **务必先使用 sequential-thinking MCP 工具**拆解用户问题
- 通过拆解识别问题的核心要素和关键信息点
- 基于拆解结果确定需要收集的上下文信息
- 避免遗漏重要的问题维度

### 1. 信息完整性
- 提供足够的上下文信息
- 描述当前问题和期望结果
- 包含相关的技术细节

### 2. 问题明确性
- 将复杂问题分解为具体的子问题
- 避免过于宽泛的询问
- 明确优先级和约束条件

### 3. 格式规范
- 使用单引号包围整个 JSON 消息
- JSON 内部使用双引号表示字符串
- 确保 JSON 格式正确，可以先验证格式
- 保持 JSON 结构清晰，必要时可以压缩为单行

### 4. JSON 字段说明
- `context`: 项目背景和技术环境
- `current_status`: 当前实现状态
- `problem`: 需要解决的具体问题
- `goal`: 期望达到的目标
- `constraints`: 限制条件（可选）
- `priority`: 优先级 high/medium/low（可选）
- `details`: 补充细节信息（可选）

## 注意事项

1. **问题拆解（必需）**：在使用 codex 之前，**必须**先使用 sequential-thinking MCP 工具拆解问题，这是工作流程中不可跳过的步骤
2. **JSON 格式**：确保 JSON 格式正确，避免语法错误
3. **引号使用**：外层使用单引号，JSON 内部使用双引号
4. **特殊字符**：JSON 字符串中的特殊字符需要转义
5. **只读模式**：当前使用只读模式，codex 不会修改文件
6. **仓库检查**：跳过 Git 仓库检查以提高执行速度

## 错误处理
如果命令执行失败，检查：
- JSON 格式是否正确（可使用在线 JSON 验证器）
- 引号是否正确使用（外层单引号，内层双引号）
- 是否存在未转义的特殊字符
- codex 命令是否可用

## JSON 格式验证
在使用前可以验证 JSON 格式：
```bash
echo '{"context":"test","problem":"test"}' | python -m json.tool
```

## 扩展用法
可以结合其他参数使用，具体参数可通过 `codex --help` 查看。

## 快速模板

**⚠️ 重要提醒**：在使用以下模板之前，请务必先使用 `sequential-thinking` MCP 工具拆解用户问题！

复制以下模板并填入具体信息：
```json
{
  "context": "项目技术栈和背景",
  "current_status": "当前状态描述",
  "problem": "具体问题描述",
  "goal": "期望达成的目标",
  "priority": "high"
}
```
