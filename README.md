# AiCoding Projects

使用 AI 辅助完成的编程练习项目集合。每个项目都是与 AI 协作，从零到一独立完成的前端实践。

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 📂 项目列表

| 项目 | 说明 | 技术栈 |
|------|------|--------|
| [minesweeper](minesweeper/) | 扫雷游戏，经典 Windows 扫雷的 Web 复刻 | React · TypeScript · Vite |
| [google](google/) | Google 谷歌搜索首页精准复刻 | HTML · CSS · Vanilla JS |

## 🎯 目标

通过 AI 辅助编程，快速上手不同技术栈，积累可运行的完整项目。每个项目强调：

- **完整性** — 从初始搭建到可运行，而非仅代码片段
- **可用性** — 核心交互逻辑完整，能在浏览器中真正使用
- **规范性** — 结构清晰、注释到位、命名一致
- **独立性** — 每个项目自包含，不互相依赖

## 🚀 本地运行

```bash
# 纯前端项目 — 直接用浏览器打开即可
open google/google-search.html

# Vite / React 项目
cd minesweeper
npm install
npm run dev
```

## 📁 目录结构

```
aicoding/
├── google/
│   ├── google-search.html   # Google 首页复刻
│   └── README.md
├── minesweeper/
│   ├── src/                 # React 源码
│   ├── dist/                # 构建产物
│   ├── package.json
│   └── README.md
└── README.md                # 本文件
```

## 🛠 关于 AI 协作

本仓库所有项目均使用 Claude（Anthropic）辅助完成。协作模式包括：

- **需求分析** — AI 帮助拆解需求、确认技术方案
- **代码生成** — 逐模块生成代码，人工复核调整
- **调试优化** — AI 辅助定位问题、优化样式和逻辑
- **文档输出** — 生成 README 等项目文档

每个项目都是"人定方向、AI 执行、人做审核"的协作产物。

## 📄 License

MIT © [Careylq](https://github.com/Careylq)
