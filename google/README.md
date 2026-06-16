# Google Search Homepage Clone

精准还原 Google 谷歌搜索首页的纯前端实现，单文件 HTML，零外部依赖。

![Google Clone](https://img.shields.io/badge/HTML-CSS--JS-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)

## 🔍 预览

在浏览器中直接打开 `google-search.html` 即可查看效果。

## ✨ 特性

- **高度还原** — 顶部导航栏、居中 Logo + 搜索框 + 双按钮、底部页脚，布局严格对齐原版
- **细节到位** — 搜索框圆角 `24px`、悬停阴影、聚焦高亮、按钮 hover 态与原版一致
- **内联 SVG Logo** — 使用标准 Google 四色（蓝/红/黄/蓝/绿/红），不依赖外部图片资源
- **完整交互** — 搜索输入、回车搜索、清空按钮、「手气不错」跳转
- **响应式适配** — 移动端布局不错乱，`650px` / `360px` 双断点
- **纯前端** — 单文件 HTML，内联 CSS + 原生 JS，零依赖，即开即用

## 🚀 快速开始

```bash
# 直接在浏览器中打开
open google-search.html

# 或用任意静态服务
npx serve .
```

## 📁 项目结构

```
google/
├── google-search.html   # 主页面（单文件，含 HTML/CSS/JS）
└── README.md            # 项目说明
```

## 🛠 技术栈

| 技术 | 说明 |
|------|------|
| HTML5 | 语义化标签，表单结构 |
| CSS3 | Flexbox 布局、过渡动画、媒体查询响应式 |
| Vanilla JS | 搜索交互、DOM 操作，无框架 |

## 📸 核心还原点

- **搜索框** — 灰色边框 `#dfe1e5`，悬停和聚焦时升起阴影，左侧放大镜 + 右侧语音图标
- **按钮** — `#f8f9fa` 底色，`4px` 圆角，悬停浮现边框和阴影
- **登录按钮** — Google 蓝 `#1a73e8`，带悬停加深和阴影效果
- **应用菜单图标** — 九宫格 SVG，悬停圆形灰色背景
- **页脚** — 浅灰底色 `#f2f2f2`，上下分区，链接左右分布

## 🔗 相关链接

- 项目仓库：[Careylq/AiCoding-projects](https://github.com/Careylq/AiCoding-projects)

## 📄 License

MIT © [Careylq](https://github.com/Careylq)
