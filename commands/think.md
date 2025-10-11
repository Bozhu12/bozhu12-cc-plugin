---
argument-hint: "[--1|--2|--3] <prompt>"
---

# /think - 智能思考

这是一个智能思考命令，可以通过参数控制思考级别：

## 参数说明
- `--1` : 基础思考模式 (默认)
- `--2` : 加强思考模式  
- `--3` : 超强思考模式

## 使用示例
```
/think --1 分析这个代码问题
/think --2 深入思考解决方案
/think --3 全面分析和优化建议
```

---

{% if "-- 1" in prompt or "--1" in prompt %}
think

{{ prompt | replace("--1", "") | replace("-- 1", "") | trim }}
{% elif "-- 2" in prompt or "--2" in prompt %}
think harder

{{ prompt | replace("--2", "") | replace("-- 2", "") | trim }}
{% elif "-- 3" in prompt or "--3" in prompt %}
ultrathink

{{ prompt | replace("--3", "") | replace("-- 3", "") | trim }}
{% else %}
think

{{ prompt }}
{% endif %}