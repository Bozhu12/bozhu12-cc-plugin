---
title: "Claude Agent 智能路由规划器"
version: "v4.0"
date: "2024-08-24"  
author: "Claude Code"
argument-hint: "[任务描述]"
---

# Agent智能路由规划器

## 核心能力

纯规划模式的智能Agent协作系统：
- **智能分析**: 深度分析任务需求和技术栈
- **Agent匹配**: 自动推荐最佳Agent组合和执行策略
- **规划输出**: 生成详细的执行计划文档
- **分离设计**: 只做规划，不执行代理

## 工作流程

```
/me:route 任务描述
    ↓
1. 分析任务需求
2. 检测技术栈
3. 匹配最优Agent
4. 设计执行策略
5. 生成规划文档
    ↓
输出: ./docs/agent-route/<task-id>.md
    ↓
/me:execute <task-id>.md
```

## 指令模板

`ultrathink`思考模式

**🎯 纯规划模式 Agent路由分析 + 强制文件生成**

1. **需求解构分析**

   用户原始需求: {{ prompt }}

   任务分类:
   - 🔧 开发任务 (新功能/修复/重构) 
   - 🔍 分析任务 (代码审计/性能/架构)
   - 📚 研究任务 (技术调研/文档)
   - ⚙️ 维护任务 (部署/配置/优化)

   复杂度评估:
   - 🟢 简单任务 (1个Agent, 5-15分钟)
   - 🟡 中等复杂 (2-4个Agent, 15-30分钟) 
   - 🔴 高复杂度 (5-8个Agent, 30-60分钟)

2. **可用Agent扫描**

   **系统检测可用Agent:**
   - 扫描 Claude Code 内置Agent列表
   - 识别 User agents 和 Project agents
   - 过滤重复Agent，建立可用Agent池

3. **技术栈智能检测**

   **工作区配置分析:** `CLAUDE.md` + 项目文件

   **配置文件识别策略:**
   ```
   📦 包管理器检测:
   ├── package.json → Node.js生态系统
   ├── pom.xml → Java/Maven生态  
   ├── requirements.txt → Python生态
   ├── Cargo.toml → Rust生态
   ├── go.mod → Go生态
   └── pubspec.yaml → Flutter/Dart生态
   
   🎯 框架特征识别:
   ├── src/components → React/Vue前端项目
   ├── src/main/java → Spring Boot后端项目
   ├── lib/ + pubspec.yaml → Flutter移动项目
   └── 导入语句模式分析
   ```

   **Agent匹配计算:** `匹配度 = 技术适配度×40% + 任务复杂度匹配×30% + 生态熟悉度×20% + 项目规模适配×10%` 

4. **Agent协作规划设计**

   **规划输出格式:**
   ```typescript
   // Agent执行计划规范
   interface AgentPlan {
     task_id: string;           // 任务唯一标识
     agent_type: string;        // Agent类型标识
     display_name: string;      // Agent显示名称
     description: string;       // 任务描述
     prompt_template: string;   // 提示词模板
     dependencies: string[];    // 依赖的其他Agent
     execution_order: number;   // 执行顺序(并行时为相同数字)
     estimated_time: number;    // 预估执行时间(分钟)
     parallel_safe: boolean;    // 是否可并行执行
     context_requirements: {    // 上下文要求
       input_files: string[];
       shared_variables: Record<string, string>;
       dependency_outputs: string[];
     };
   }
   
   // 整体规划方案
   interface ExecutionPlan {
     plan_id: string;          // 规划标识
     created_at: string;       // 创建时间
     task_description: string; // 原始任务描述
     complexity: 'simple' | 'medium' | 'complex';
     execution_mode: 'sequential' | 'parallel' | 'hybrid';
     agents: AgentPlan[];      // Agent执行计划列表
     estimated_total_time: number;
   }
   ```

5. **执行模式规划策略**

   **🔄 Fork-Join并行规划**
   ```
   适用场景: 独立子任务可并行处理
   
   规划输出:
   ├── 并行阶段设计:
   │   ├── project-analyst (order: 1)
   │   ├── backend-developer (order: 1) 
   │   ├── frontend-developer (order: 1)
   │   └── database-expert (order: 1)
   │
   └── 汇聚阶段设计:
       └── code-reviewer (order: 2, deps: [all])
   
   预估时间: max(并行Agent时间) + 汇聚Agent时间
   ```

   **⚡ Pipeline流水线规划**
   ```
   适用场景: 有明确依赖关系的任务序列
   
   规划输出:
   Stage1: project-analyst (order: 1)
     └── 输出规划: 项目架构分析文档
   
   Stage2: api-architect (order: 2, deps: [project-analyst])
     └── 输出规划: API设计方案文档
   
   Stage3: 并行实现 (order: 3, deps: [api-architect])
     ├── backend-developer → 后端实现
     └── frontend-developer → 前端实现
   
   Stage4: code-reviewer (order: 4, deps: [stage3_all])
     └── 输出规划: 代码质量报告
   
   预估时间: sum(所有Stage时间)
   ```

6. **规划文档生成策略**

   **📋 规划输出流程:**
   ```
   🎯 智能规划生成
   
   1. 需求解析 → 任务分解
   2. Agent匹配 → 最优组合推荐  
   3. 执行策略 → 模式选择(串行/并行/混合)
   4. 时间估算 → 基于复杂度和Agent能力
   5. 风险评估 → 潜在问题和缓解策略
   6. 文档生成 → 标准化规划文档
   7. 执行验证 → 确保文件写入成功
   
   ✅ **执行完整性保证:**
   - 文档位置: `./docs/agent-route/<task-id>.md`
   - 标准格式: YAML metadata + Markdown content
   - 完整信息: Agent配置 + 执行顺序 + 依赖关系
   - 可执行性: 与 /me:execute 完全兼容
   - 写入验证: 必须确认文件成功创建
   
   🚫 **严格限制:**
   - 不启动任何 Agent
   - 只输出规划文档
   - 文档只能输出到 `./docs/agent-route/`目录
   
   💣 **失败模式处理:**
   - 如果 Write 工具调用失败 → 命令执行失败
   - 如果文件未成功创建 → 命令执行失败
   - 如果目录不存在 → 自动创建后重试
   ```
   
   **📄 生成文档模板:**
   ```markdown
   ---
   task_id: "task-{timestamp}"
   created_at: "{iso_datetime}"
   task_description: "{original_prompt}"
   complexity: "{simple|medium|complex}"
   execution_mode: "{sequential|parallel|hybrid}"
   estimated_total_time: {minutes}
   tech_stack: ["{detected_technologies}"]
   ---
   
   # Agent执行规划: {task_description}
   
   ## 📊 任务分析
   - **任务类型**: {task_type}
   - **复杂度**: {complexity_level}
   - **预估时间**: {total_time}分钟
   - **推荐模式**: {execution_mode}
   
   ## 🤖 Agent配置
   {agent_list_with_details}
   
   ## 📈 执行流程
   {execution_order_diagram}
   
   ## ⚠️ 风险评估
   {potential_risks_and_mitigations}
   
   ## 🎯 预期输出
   {expected_deliverables}
   ```
   
   **🔨 强制执行检查清单:**
   ```
   ✅ 必须完成的操作:
   1. 检查 ./docs/agent-route/ 目录存在 (LS工具)
   2. 生成完整的规划文档内容 (内存处理)
   3. 调用 Write 工具写入文档文件 (文件系统)
   4. 验证文件确实创建成功 (可选: 再次LS确认)
   5. 返回文档路径给用户 (交互反馈)
   
   ❌ 命令失败条件:
   - 没有调用 Write 工具
   - Write 工具调用失败
   - 生成的文档格式不符合模板要求
   - 文档路径不在 ./docs/agent-route/ 目录
   ```


## 规划示例

**🔍 分析任务规划:**
```bash
/me:route 优化数据库查询性能，特别是用户表的分页查询

📋 生成规划文档:
├── 任务ID: task-20240824-001
├── 技术栈检测: Spring Boot + MySQL  
├── 复杂度评估: 🟡 中等复杂(15-25分钟)
├── 推荐模式: Sequential Pipeline
├── Agent配置: 
│   ├── project-analyst (order: 1)
│   ├── performance-optimizer (order: 2) 
│   └── code-reviewer (order: 3)
└── 输出位置: ./docs/agent-route/task-20240824-001.md

✅ 规划完成! 执行: /me:execute task-20240824-001.md
```

**🛠️ 开发任务规划:**
```bash  
/me:route 全栈开发用户管理系统 

📋 生成规划文档:
├── 任务ID: task-20240824-002
├── 技术栈检测: React + Spring Boot + PostgreSQL
├── 复杂度评估: 🔴 高复杂度(45-60分钟)
├── 推荐模式: Hybrid (Pipeline + Fork-Join)
├── Agent配置: 
│   ├── Phase1: project-analyst (order: 1)
│   ├── Phase2: api-architect (order: 2)
│   ├── Phase3: backend-developer + frontend-developer (order: 3, parallel)
│   └── Phase4: code-reviewer (order: 4)
└── 输出位置: ./docs/agent-route/task-20240824-002.md

✅ 规划完成! 执行: /me:execute task-20240824-001.md
```

**🚫 重要注意:**

- 文档只能输出到 `./docs/agent-route/`目录
- `/me:route` 指令只生成规划文档，不执行任何Agent
- 必须通过 `/me:execute <task-id>.md` 才能真正执行规划
- 规划文档包含完整的执行配置和风险评估
