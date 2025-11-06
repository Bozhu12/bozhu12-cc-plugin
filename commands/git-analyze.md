---
title: "/me:git-analyze - Git工作区智能分析器"
version: "v1.0"
date: "2025-08-28"
author: "Claude Code"
argument-hint: ""
---

# Git工作区智能分析器

## 指令语法

```bash
/me:git-analyze [选项]
```


### 使用示例

```bash
# 全面分析工作区所有变更，包含品味评估和风险检查
/me:git-analyze
```

## 智能分组系统

自动识别最佳分组方式，无需手动选择：

```
🎯 智能分析结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 功能开发 (Feature) - 4个文件
├── UserController.java:267 (+45/-5)
├── User.java:89 (+12/-0)  
├── UserProfile.vue:156 (+89/-23)
└── UserService.java:234 (+34/-8)

🔄 文件变更 (Changes)
├── ~~OrderService.java~~ -> OrderServiceImpl.java (重命名)
├── ~~LegacyController.java~~ (删除)
└── + NewFeatureService.java:156 (新增)

🔧 Bug修复 (Bugfix) - 3个文件
├── OrderService.java:145 (+8/-7)
├── LoginForm.vue:67 (+5/-3)
└── ValidationUtil.java:23 (+12/-5)

⚙️ 配置调整 (Config) - 3个文件
├── application.yml:45 (+3/-1)
├── pom.xml:156 (+7/-2)
└── webpack.config.js:89 (+4/-1)

📚 文档更新 (Docs) - 2个文件
├── README.md:234 (+23/-5)
└── user-api.md:67 (+15/-0)
```

### 文件操作格式说明

```
文件操作显示格式:
├── filename.java:267 (+45/-5)                    # 修改文件: 行数 (新增/删除)
├── ~~oldname.java~~ -> newname.java (re)       # 重命名操作  
├── ~~deleted.java~~ (del)                       # 删除文件
└── + newfile.java:89 (add)                      # 新增文件: 总行数
```

## 执行流程

### 1. Git状态扫描
```
🔍 扫描git工作区状态
├── git status: 获取修改文件列表
├── git diff: 分析具体修改内容
├── git diff --cached: 检查暂存区内容
└── 文件类型识别: 基于扩展名和内容特征
```

### 2. 智能分组处理
```
🤖 自动分组引擎
├── 修改类型识别: 功能/Bug修复/配置/文档
├── 影响范围评估: 局部/模块/全局影响
├── 复杂度计算: 基于行数变更和逻辑复杂度
└── 最佳展示: 选择最有意义的分组方式
```

### 3. 上下文融合分析
```
📖 结合CLAUDE.md进行上下文分析
├── 项目结构理解: 识别关键目录和文件
├── 技术栈适配: 基于检测到的框架进行专业分析
├── 编码规范: 对照项目规范检查修改内容
└── 最佳实践: 提供针对性的改进建议
```

## 输出报告格式

### 完整分析输出
```
📊 Git工作区分析报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 修改概览:
├── 修改文件: 12个  
├── 新增文件: 3个
├── 删除文件: 1个
├── 总行数变更: +456 -123行
└── 影响模块: 用户管理、订单处理

🎯 主要变更:
├── UserController.java:267 (+45/-5)
├── UserService.java:156 (+23/-8)
├── UserProfile.vue:234 (+89/-23)
├── ~~OrderService.java~~ -> OrderServiceImpl.java (re)
├── ~~LegacyUtil.java~~ (del)
├── + NewFeatureService.java:89 (add)
├── application.yml:45 (+3/-1)
└── README.md:123 (+15/-3)
```

### 代码品味和风险评估
```
🧠 Linus式品味分析:
😎 好品味代码:
✅ UserService.java:45-67
    - (45) 消除了特殊情况处理，统一用Optional<T>包装返回值
    - (49-60) 继承JwtToken，统一令牌体系，没有特殊分支

🤔 凑合的代码:
⚠️ OrderController.java:78-95
    - (78-90) if-else链较长，建议用策略模式
    - (88) 每个方法都是这个套路

💩 垃圾代码:
❌ LegacyService.java:234-267
    - (234-267) 超过4层缩进，嵌套地狱需重构
```

> 不要输出代码 , 直接说问题 , 精简形式

## 严格安全限制

### 🚫 禁止的操作
```
❌ 用户可许前不执行的Git操作:
├── git add (任何形式的暂存)
├── git commit (任何形式的提交)  
├── git push (任何形式的推送)
├── git merge (合并操作)
├── git rebase (变基操作)
├── git reset (重置操作)
├── git checkout (检出切换，除非明确只是查看)
└── git stash (储藏操作)
```

### ✅ 允许读操作
```
✅ 安全的分析操作:
├── git status (状态查看)
├── git diff (差异分析)
├── git log --oneline -10 (最近提交记录)
├── git branch (分支信息)
├── git remote -v (远程仓库信息)  
└── 文件内容读取 (Read工具)
```

## 常见问题

**工作区为空**
```bash
ℹ️ 检测结果: 工作区无未提交修改
建议: 检查是否在正确的git仓库目录
```

**非git仓库**
```bash
❌ 当前目录不是git仓库
解决: 切换到git项目根目录执行
```

---

**🔥 核心价值：让每次git提交都经过深度思考，提升代码质量**
