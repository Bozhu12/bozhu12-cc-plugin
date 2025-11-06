---
argument-hint: "<prompt>"
---

# JSON快照


## 意图

- 将当前工作区与用户提供的显式信息压缩为一段精简 JSON，供其他大模型新会话开场使用。
- JSON 仅保留关键信息，确保对话能够快速获得项目背景、当前目标与硬性约束。

## 工作流

1. **问题拆解**：使用 `sequential-thinking` MCP 拆解问题
2. **信息整理**：根据拆解结果组织上下文和问题细节
3. **提炼构建JSON**：提炼用户最新指令的目标、限制、交付物等要求。

## JSON规范

- 统一使用 UTF-8 编码与紧凑格式。
- 所有字段名使用小写蛇形命名（snake_case）。
- 可选字段按需添加，避免冗余。
- 必选字段 : `task` , `goal` , `todo`

| 键                | 格式   | 说明                                   |
| ----------------- | ------ | -------------------------------------- |
| **task**          | 字符串 | 任务概述                               |
| **constraints**   | 数组   | 列出权限、禁止操作、既有流程等硬性约束 |
| **output_format** | 字符串 | 输出形式                               |
| **output_path**   | 字符串 | 指定性输出路径                         |
| **output_style**  | 数组   | 输出风格                               |
| **goal**          | 字符串 | 目标定位 (抽象宽泛式)                  |
| **todo**          | 数组   | 待办事项                               |
| **deliverable**   | 数组   | 具体交付说明                           |
| **priority**      | 字符串 | 任务优先级                             |
| **resources**     | 数组   | 列出相关性的所有资源(文件)             |
| **tags**          | 数组   | 任务相关性信息                         |
| ...               | ...    | ....                                   |

> 以上是给字段引用仅限参考使用

## JSON输出

**仅供参考**

### API接口设计文档

```json
{
    "task": "API接口设计文档",
    "style": ["深度分析", "心思缜密", "精简优雅"],
    "output_format": "md文档",
    "goal": "写一个API接口, 接口用于给用户首次问题使用的 , 根据库中的历史提问最多排序出来让用户选",
    "api_input": ["userId", "orgId", "limit"],
    "api_output": "{\"code\":200,\"message\":\"success\",\"data\":[{\"question\":\"分析薪酬表\",\"count\":13,\"rank\":1},{\"question\":\"进入双Y轴相关的图表\",\"count\":7,\"rank\":2},{\"question\":\"帮处理薪酬数据的自助分析\",\"count\":3,\"rank\":3}]}",
    "explain": [
        "上级提出的需求一定要服从, 不能质疑", 
        "可考虑多种方案",
        "目前考虑的是在messages_json中首个对话 , 后续会对其他用户内容进行推荐处理",
        "允许加时间过滤: 最近3个月内的对话历史"
    ],
    "use_utils": {
        "mysql": {
            "database": "langchain4j",
            "table": "chat_memory",
            "field": ["messages_json", "user_id", "org_id"],
            "field_metadata": {
                "messages_json_construction": "[{\"type\":\"USER\",\"contents\":[{\"text\":\"分析薪酬表\\n\\nAnswer using the following information:\\n你的本地知识库信息\",\"type\":\"TEXT\"}]},{\"type\":\"AI\",\"text\":\"AI回复内容...\"}]"
            },
            "input": ["user_id", "org_id", "last_updated", "limit"],
            "describe": "查出数据后 提取messages_json 中首次提问最多整理为列表有高到底"
        }
    }
}
```

### 写代码

```json
{
  "task": "写代码",
  "language": "Python",
  "goal": "写个脚本重命名文件夹所有文件",
  "constraints": ["得在MacOS上跑", "加注释"],
  "output_format": "只给代码，不解释"
}
```

### 创建咨询文档

```json
{
  "task": "创建咨询文档",
  "input_data": "在此处粘贴你的原始研究、数据或笔记",
  "client": "一家希望提升线上销量的本地连锁咖啡店",
  "deliverables": [
    "SWOT分析（优势、劣势、机会、威胁）",
    "线上增长策略路线图（3个阶段）",
    "3个可以立即执行的‘速赢’建议"
  ],
  "output_format": "Markdown格式",
  "tone": "犀利、可执行"
}
```

