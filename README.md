# IM Prototyping — 快速产品原型沙盒

> 一个用于快速构建、探索和验证移动端 IM（即时通讯）产品体验的沙盒框架。

---

## 项目目标

本项目是一个**非生产环境**的原型沙盒，核心目的：

1. **快速原型探索** — 用最低成本还原 TikTok 风格的移动端 IM 体验，用于体验验证与团队沟通
2. **AI 辅助开发友好** — 项目结构极简、约定清晰，方便使用 v0 等 AI 工具直接生成可运行的页面和组件
3. **可扩展** — 当前 MVP 聚焦 Inbox + Chat，但框架结构支持后续快速扩展 Feed、Profile 等模块

### MVP 业务范围

| 模块 | 说明 | 状态 |
|------|------|------|
| **Inbox** | TikTok 风格的消息盒子（通知 + DM 列表） | 🔨 进行中 |
| **Chat** | 1v1 私信聊天详情页（全屏 Push） | 📋 计划中 |
| Feed | 信息流 / 推荐页 | 🕐 未来 |
| Profile | 个人主页 | 🕐 未来 |

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Next.js** (App Router) | 16.x | 页面路由与 SSR 框架 |
| **React** | 19.x | UI 渲染 |
| **Tailwind CSS** | v4 | 原子化样式，所有样式直接写 Tailwind class |
| **TypeScript** | 5.x | 类型安全 |

### 不使用的技术

- ❌ shadcn/ui — 本项目组件高度自定义（移动端 TikTok 风格），shadcn 的桌面端预制组件帮助有限，保持极简不引入
- ❌ 复杂状态管理（Redux / Zustand 等）— 原型阶段不需要
- ❌ 后端 API / 数据库 — 全部使用本地 Mock 数据

---

## 项目结构

```
src/
├── app/                            # 页面路由层
│   ├── layout.tsx                  # 根布局（字体、全局 meta）
│   ├── globals.css                 # 全局样式（Tailwind 入口 + 自定义 CSS）
│   │
│   ├── (main)/                     # 🏠 主干路由分组（带底部导航栏）
│   │   ├── layout.tsx              # 移动端全局容器 + BottomNav 布局
│   │   ├── inbox/
│   │   │   └── page.tsx            # Inbox 消息列表页
│   │   ├── feed/                   # [未来扩展]
│   │   │   └── page.tsx
│   │   └── profile/                # [未来扩展]
│   │       └── page.tsx
│   │
│   └── chat/                       # 💬 独立路由（全屏 Push，无底部导航）
│       └── [id]/
│           └── page.tsx            # DM 聊天详情页
│
├── components/                     # 组件层
│   ├── ui/                         # 基础 UI 组件（Button, Badge, Input 等）
│   │                               # 通用、无业务逻辑、可跨模块复用
│   ├── layout/                     # 布局组件
│   │   ├── BottomNav.tsx           # 底部导航栏
│   │   ├── TopBar.tsx              # 顶部导航栏
│   │   └── MobileShell.tsx         # 移动端缩放容器
│   └── features/                   # 业务模块组件（按领域分文件夹）
│       ├── inbox/                  # Inbox 专属组件
│       │   ├── InboxCell.tsx
│       │   ├── InboxLeadingIcon.tsx
│       │   └── ...
│       ├── chat/                   # Chat 专属组件
│       │   ├── ChatBubble.tsx
│       │   ├── ChatInput.tsx
│       │   └── ...
│       ├── feed/                   # [未来扩展] Feed 专属组件
│       └── profile/                # [未来扩展] Profile 专属组件
│
├── lib/                            # 工具与数据层
│   ├── mock/                       # 极简 Mock 数据（Type + Data 聚合）
│   │   ├── inbox.ts                # Inbox 类型定义 + Mock 数据
│   │   ├── chat.ts                 # Chat 类型定义 + Mock 数据
│   │   ├── feed.ts                 # [未来扩展]
│   │   └── user.ts                 # [未来扩展] 用户相关通用数据
│   └── utils.ts                    # 基础工具函数
│
└── public/
    └── images/                     # 静态图片资源
        └── avatars/                # 头像图片
```

---

## 核心架构约定

### 1. 路由分组规则

| 分组 | 路径模式 | 底部导航 | 用途 |
|------|---------|---------|------|
| **`(main)`** | `app/(main)/*` | ✅ 有 | 主干页面：Inbox、Feed、Profile 等 |
| **独立路由** | `app/chat/*`、`app/settings/*` 等 | ❌ 无 | 全屏 Push 页面：聊天详情、设置页等 |

**扩展方式**：新增主干页面时，在 `(main)/` 下新建文件夹即可自动获得底部导航栏。新增全屏页面时，在 `app/` 根目录下建独立文件夹。

### 2. 组件分层规则

```
components/
├── ui/          → 基础积木（无业务逻辑，可被任何模块引用）
├── layout/      → 布局骨架（导航栏、容器壳子，与路由结构强绑定）
└── features/    → 业务组件（按模块隔离，只服务于对应的业务页面）
```

**原则**：
- `ui/` 中的组件不 import 任何 `mock/` 或 `features/` 的内容
- `features/inbox/` 中的组件只从 `lib/mock/inbox.ts` 取数据
- `layout/` 中的组件不包含特定业务逻辑

### 3. Mock 数据规范（Type + Data 合一）

每个业务模块在 `lib/mock/` 下对应一个文件，文件内结构固定：

```typescript
// lib/mock/inbox.ts

// ——— 1. 类型定义 ———
export interface InboxDMItem {
  id: string;
  title: string;
  message: string;
  avatar: string;
  // ...
}

// ——— 2. Mock 数据 ———
export const mockDMItems: InboxDMItem[] = [
  { id: "dm1", title: "Taoo425", message: "Count me in plzz.", avatar: "/images/avatars/taoo.png" },
  // ...
];
```

**要求**：
- 所有业务组件必须直接从 `lib/mock/` 导入数据，不从其它位置取数据
- 不需要单独的 `types/` 文件夹，类型和数据永远在同一个文件
- 数据保持扁平，不搞多层嵌套

### 4. 移动端缩放策略

所有页面基于 **390px 设计宽度**等比缩放：

```
scale = viewportWidth / 390
designHeight = viewportHeight / scale
```

容器以 390px 固定宽度渲染，通过 `transform: scale()` 适配任意屏幕。不使用响应式断点或百分比布局。

---

## 扩展指南

### 新增一个主干页面（如 Feed）

1. 创建路由：`app/(main)/feed/page.tsx`
2. 创建 Mock 数据：`lib/mock/feed.ts`（定义类型 + 导出假数据）
3. 创建业务组件：`components/features/feed/` 目录下按需添加
4. 在 `BottomNav` 中添加对应 Tab 项

### 新增一个全屏 Push 页面（如 Settings）

1. 创建路由：`app/settings/page.tsx`
2. 该页面不在 `(main)` 分组内，自动不带底部导航栏
3. 如需 Mock 数据，在 `lib/mock/` 下对应新增文件

### 使用 v0 生成组件

给 v0 的 Prompt 建议包含以下约束：

```
技术栈：Next.js App Router + Tailwind CSS（v4）+ TypeScript
不使用 shadcn/ui，用纯 Tailwind 手写样式
移动端设计，固定 390px 设计宽度
数据直接从 lib/mock/xxx.ts 导入，不需要 API 调用
```

---

## 本地开发

```bash
# 安装依赖（使用公共 npm 源）
npm install --registry=https://registry.npmjs.org

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

---

## 注意事项

- 这是**原型沙盒**，不是生产项目，优先速度和体验还原度，不追求性能优化
- 所有 `[未来扩展]` 标记的目录/文件在实际用到时再创建，不要提前建空文件夹
- `claude.md` 文件包含了针对 AI 代码生成的项目规则（缩放策略、npm 源等），请保留
