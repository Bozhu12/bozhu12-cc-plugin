---
argument-hint: "<内容描述>"
---

# 智能文档目录生成器

根据内容描述自动生成合适的文档目录，告别手动选择的烦恼。

## 功能说明
- 智能分析内容描述，自动选择最佳目录名称
- 遵循简洁明了的命名规范

## 参数说明
- `内容描述` : 文档内容的简要描述

## 使用示例
```
/doc 创建Vue组件开发文档
/doc 根据上文对话输出文档
/doc 后端API设计规范
/doc 数据库设计和优化
```

---

{# 智能目录名生成 - 基于关键词直接匹配 #}
{% set content_desc = prompt %}
{% set keywords = content_desc | lower %}
{# 简单关键词映射 - 一次扫描搞定 #}
{% set dir_name = "misc" %}

{# 按优先级检查关键词 #}
{% if "vue" in keywords or "nuxt" in keywords or "composition" in keywords %}
  {% set dir_name = "vue-comp" %}
{% elif "react" in keywords or "jsx" in keywords or "hooks" in keywords %}
  {% set dir_name = "react-comp" %}
{% elif "api" in keywords or "接口" in keywords or "restful" in keywords %}
  {% set dir_name = "api-design" %}
{% elif "数据库" in keywords or "sql" in keywords or "database" in keywords %}
  {% set dir_name = "database" %}
{% elif "部署" in keywords or "docker" in keywords or "deployment" in keywords %}
  {% set dir_name = "deployment" %}
{% elif "测试" in keywords or "test" in keywords %}
  {% set dir_name = "testing" %}
{% elif "文档" in keywords or "规范" in keywords or "指南" in keywords %}
  {% set dir_name = "docs" %}
{% endif %}

请在 `./docs/{{ dir_name }}/` 目录下创建相关文档。

**目录说明：** {{ dir_name }} - {{ content_desc }}