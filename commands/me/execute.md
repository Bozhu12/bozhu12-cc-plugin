---
title: "/me:execute - Claude Code智能执行器 v2.0"
version: "v2.0"
date: "2024-08-24"
author: "Claude Code"
argument-hint: " <task-id> [--mode=auto|concurrent|sequential] [--validate|--dry-run]"
---

# Claude Code智能执行器

## 核心升级

基于Claude Code**真实并发能力**的实用执行器：
- **真并发执行**: 单次响应中启动多个Task工具
- **文件系统状态管理**: 通过文件共享Agent状态
- **智能执行模式**: 自动选择最优执行策略
- **部分恢复能力**: 支持失败任务的断点续执行

## 语法

```bash
/me:execute <task-id> [选项]
```

## 参数详解

### 必需参数
- `<task-id>` - 任务标识，对应 `./docs/agent-route/<task-id>.md`

### 执行模式
- `--mode=auto` - 智能模式：自动选择最优执行策略 (默认)
- `--mode=concurrent` - 并发模式：所有独立Agent并行启动
- `--mode=sequential` - 串行模式：传统逐个执行

### 控制选项  
- `--validate` - 验证任务文档和依赖关系
- `--dry-run` - 显示执行计划和并发策略

## 智能执行策略

### 🧠 Auto模式 (推荐)

```
自动分析任务依赖 → 选择最优执行策略

简单任务 (1-2个Agent):
  └── 直接并发执行

复杂任务 (3+个Agent):
  ├── 独立Agent → 并发执行  
  ├── 依赖Agent → 串行执行
  └── 混合策略 → 分阶段并发

时间估算:
  ├── 并发: max(Agent_time) + 5%同步开销
  └── 串行: sum(Agent_time) + 10%切换开销
```

### ⚡ Concurrent模式

```
最大并发策略 - 适用于独立任务

执行方式:
  ├── 一次性启动所有Agent
  ├── 文件系统状态同步
  ├── 等待所有Agent完成
  └── 收集执行结果

优势: 最快执行速度
限制: 忽略依赖关系，可能出现冲突
```

### 🔄 Sequential模式

```
传统串行策略 - 适用于强依赖任务

执行方式:
  ├── 逐个启动Agent
  ├── 等待当前完成再启动下一个
  ├── 严格按顺序执行
  └── 确保依赖正确传递

优势: 最安全，依赖清晰
限制: 执行时间较长
```

## 工作原理

### 🔧 执行流程

1. **任务解析**: 读取route文档，分析Agent配置
2. **依赖分析**: 构建Agent依赖图，确定执行顺序
3. **策略选择**: 根据模式选择最优执行策略
4. **状态初始化**: 创建状态管理文件结构
5. **并发执行**: 利用Task工具的真实并发能力
6. **状态同步**: 通过文件系统同步Agent状态
7. **结果收集**: 汇总所有Agent执行结果
8. **清理工作**: 整理输出文件，生成报告

### 🎯 Claude Code适配

```typescript
// 基于Claude Code真实能力的实现
function executeConcurrentTasks(agents: Agent[]) {
  // 单次响应中的多Task调用
  const tasks = agents.map(agent => 
    Task({
      subagent_type: agent.type,
      description: agent.description,
      prompt: agent.promptWithContext()
    })
  );
  
  // 并发启动所有Task
  return Promise.all(tasks);
}
```

## 故障排除

### 常见问题

**任务文档格式错误**
```bash
❌ 解析失败：route文档格式不正确
检查：./docs/agent-route/task-001.md

解决：运行 /me:execute task-001 --validate
```

**状态文件冲突**
```bash
⚠️ 检测到状态文件冲突
位置：.claude-state/task-001/progress.json

解决：删除状态文件重新执行，或使用 --resume 恢复
```

### 调试工具

```bash
# 验证任务配置
/me:execute task-001 --validate

# 查看执行计划
/me:execute task-001 --dry-run

# 检查状态文件
ls .claude-state/task-001/

# 查看详细日志  
cat .claude-state/task-001/logs/execution.log
```
