# Claude Code + Figma MCP + Playwright MCP 搭建指南

> 本文档介绍如何为 `im_prototyping` 项目配置 Claude Code，接入 Figma MCP 和 Playwright MCP，实现 **Figma 设计稿 → 代码 → 截图验证** 的 vibe coding 闭环。

---

## 目录

1. [概念介绍](#1-概念介绍)
2. [环境准备](#2-环境准备)
3. [安装 Claude Code](#3-安装-claude-code)
4. [配置 MCP Servers](#4-配置-mcp-servers)
5. [获取 Figma Access Token](#5-获取-figma-access-token)
6. [验证 MCP 连接](#6-验证-mcp-连接)
7. [Vibe Coding 工作流](#7-vibe-coding-工作流)
8. [实战示例](#8-实战示例)
9. [常见问题](#9-常见问题)

---

## 1. 概念介绍

### 什么是 Claude Code？

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) 是 Anthropic 官方推出的 CLI 编程工具。你在终端里启动它，它可以：
- 直接读写你的代码文件
- 执行终端命令（git、npm、dev server 等）
- 通过 MCP 协议连接外部工具（Figma、Playwright、GitHub 等）

### 什么是 MCP？

**MCP（Model Context Protocol）** 是一个开放协议，让 AI 模型能调用外部工具。把它理解为"AI 的 USB 接口"——通过标准化协议，Claude 可以：

| MCP Server | Claude 能做什么 |
|---|---|
| **Figma MCP** | 读取 Figma 设计稿的节点树、样式属性、导出图标/图片 |
| **Playwright MCP** | 打开浏览器、导航页面、点击交互、截图验证 |

### 为什么需要这套组合？

传统流程：看 Figma → 手动抄样式 → 写代码 → 肉眼对比 → 反复修改

Vibe coding 流程：

```
Figma 设计稿
    ↓  (Figma MCP: 读取节点树 + 导出资源)
Claude 自动写代码
    ↓  (Playwright MCP: 启动浏览器截图)
自动对比验证
    ↓  (发现差异 → 自动修复 → 重新验证)
像素级还原 ✅
```

---

## 2. 环境准备

### 系统要求

| 依赖 | 最低版本 | 检查命令 |
|------|---------|---------|
| **Node.js** | ≥ 20 | `node --version` |
| **npm** | ≥ 10 | `npm --version` |
| **Git** | 任意现代版本 | `git --version` |

### 项目依赖安装

```bash
cd im_prototyping
npm install --registry=https://registry.npmjs.org
```

> ⚠️ **必须使用公共 npm 源**。使用内部源（npmmirror / bnpm）会污染 `package-lock.json`，导致 Vercel 部署失败。

---

## 3. 安装 Claude Code

### macOS / Linux

```bash
npm install -g @anthropic-ai/claude-code
```

### 验证安装

```bash
claude --version
```

### 首次启动

```bash
cd im_prototyping
claude
```

首次运行会要求登录 Anthropic 账号或输入 API key。按提示完成认证即可。

> 💡 Claude Code 会自动读取项目根目录的 `CLAUDE.md` 作为项目上下文指令，本项目已配置好。

---

## 4. 配置 MCP Servers

MCP 配置文件是项目根目录下的 **`.mcp.json`**。在 `im_prototyping/` 目录下创建该文件：

```bash
touch .mcp.json
```

写入以下内容：

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic-ai/figma-mcp@latest"
      ],
      "env": {
        "FIGMA_ACCESS_TOKEN": "<你的 Figma Personal Access Token>"
      }
    },
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

### 配置说明

| 字段 | 说明 |
|------|------|
| `mcpServers` | MCP server 注册表，每个 key 是 server 名称 |
| `command` | 启动 MCP server 的命令（`npx` 会自动下载并运行） |
| `args` | 命令参数。`-y` 表示自动确认安装 |
| `env` | 传给 MCP server 进程的环境变量 |

### 关于 `.mcp.json` 的作用域

| 文件位置 | 作用域 | 说明 |
|----------|--------|------|
| `项目/.mcp.json` | **项目级** | 仅在该项目目录下启动 Claude Code 时生效 |
| `~/.claude.json` | **全局级** | 所有项目共享，适合通用工具 |

本项目建议使用项目级配置。

> ⚠️ `.mcp.json` 包含 token，**不要提交到 git**。在 `.gitignore` 中添加：
> ```
> .mcp.json
> ```

---

## 5. 获取 Figma Access Token

1. 登录 [Figma](https://www.figma.com)
2. 点击左上角头像 → **Settings**
3. 滚动到 **Personal access tokens** 区域
4. 点击 **Generate new token**
5. 输入 token 描述（如 `claude-mcp`），权限选择：
   - **File content**: ✅ Read only
   - **Dev resources**: ✅ Read only
6. 点击 **Generate token**
7. **立即复制 token**（只显示一次！）
8. 粘贴到 `.mcp.json` 中 `FIGMA_ACCESS_TOKEN` 的值

### 验证 Token

在浏览器访问以下 URL（替换 `<TOKEN>`）确认 token 有效：

```
curl -H "X-Figma-Token: <TOKEN>" "https://api.figma.com/v1/me"
```

应返回你的 Figma 用户信息 JSON。

---

## 6. 验证 MCP 连接

### 启动 Claude Code

```bash
cd im_prototyping
claude
```

### 验证 Figma MCP

在 Claude Code 中输入：

```
请用 Figma MCP 获取这个文件的信息：
https://www.figma.com/design/xxxxx/你的设计稿
```

如果配置正确，Claude 会调用 `get_figma_data` 并返回设计稿的节点树信息。

### 验证 Playwright MCP

在 Claude Code 中输入：

```
请打开浏览器访问 https://example.com 并截图
```

如果配置正确，Claude 会：
1. 调用 `browser_navigate` 打开页面
2. 调用 `browser_take_screenshot` 截图
3. 返回截图结果

### 查看已连接的 MCP Servers

在 Claude Code 中输入 `/mcp` 可以查看当前所有 MCP server 的连接状态。

---

## 7. Vibe Coding 工作流

配置完成后，你可以用自然语言指挥 Claude 进行 Figma → 代码的全流程开发。以下是本项目的标准工作流：

### 第一步：让 Claude 阅读 Figma 设计稿

把 Figma 页面链接发给 Claude：

```
请根据这个 Figma 设计稿实现页面：
https://www.figma.com/design/AbCdEf/IM-Prototype?node-id=123-456
```

Claude 会自动：
1. 调用 `get_figma_data` 拉取节点树
2. 分析每层 Frame 的布局属性（flex direction、gap、padding、alignment）
3. 识别哪些元素需要导出为图片，哪些用代码实现

### 第二步：导出设计资源

Claude 会自动调用 `download_figma_images` 导出图标和图片：
- 矢量图标 → SVG 文件，存入 `public/images/icons/`
- 光栅图片 → PNG 文件（2x/3x），存入 `public/images/`

### 第三步：编写代码

Claude 根据 Figma 节点树 1:1 映射 DOM 结构，逐个属性对照实现。本项目的特殊规则（Claude 已通过 `CLAUDE.md` 知晓）：

- **390px 固定设计宽度** + `transform: scale()` 缩放策略
- 使用 **`<img>`** 而非 `next/image`
- 动画使用 **motion** 库（`motion/react`）
- Spring 物理动画，不用 ease/cubic-bezier

### 第四步：截图验证

Claude 会自动：
1. 启动 dev server（`npm run dev`）
2. 用 Playwright 设置 390×844 手机视口
3. 导航到实现的页面
4. 截图并与 Figma 导出的参考图对比
5. 发现差异 → 自动修复 → 重新截图，直到一致

### 流程图

```
┌─────────────────────────────────────────────────┐
│  你：发送 Figma 链接 + 需求描述                    │
└────────────────────┬────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│  Figma MCP: get_figma_data                      │
│  → 读取节点树、布局属性、颜色、字体               │
└────────────────────┬────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│  Figma MCP: download_figma_images               │
│  → 导出 SVG 图标、PNG 图片到 public/images/      │
└────────────────────┬────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│  Claude: 编写 React 组件代码                     │
│  → 1:1 映射 Figma 节点树到 DOM                   │
│  → 使用项目约定（390px 缩放、motion 动画等）       │
└────────────────────┬────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────┐
│  Playwright MCP: 截图验证                        │
│  → browser_resize(390, 844)                     │
│  → browser_navigate → browser_take_screenshot   │
│  → 对比 Figma 参考图                             │
└────────────────────┬────────────────────────────┘
                     ▼
              差异是否为 0？
              /          \
           Yes            No
            ▼              ▼
     ✅ 完成提交     🔄 修复后重新验证
```

---

## 8. 实战示例

### 示例 1：实现一个聊天页面

```
你：
请根据这个 Figma 设计稿实现聊天页面：
https://www.figma.com/design/xxxxx/IM?node-id=100-200

要求：
- 顶部导航栏有返回按钮和用户名
- 消息气泡区域可滚动
- 底部输入栏有 emoji 按钮、输入框、发送按钮
- 需要截图验证
```

Claude 会执行：

```
1. get_figma_data → 读取聊天页节点树
2. download_figma_images → 导出返回箭头 SVG、emoji 图标 SVG 等
3. 创建 src/app/chat/page.tsx
4. 实现导航栏、消息列表、输入栏组件
5. npm run dev → 启动 dev server
6. browser_resize(390, 844)
7. browser_navigate("http://localhost:3000/chat")
8. browser_take_screenshot → 验证
9. download_figma_images → 导出 Figma 参考截图
10. 对比 → 发现间距差异 → 修复 → 重新截图 → 通过 ✅
```

### 示例 2：从 Figma 导出并使用图标

```
你：
帮我从 Figma 导出这个页面里的所有图标：
https://www.figma.com/design/xxxxx/IM?node-id=50-100
```

Claude 会：
1. 调用 `get_figma_data` 遍历节点树，找到所有 Vector/Icon 类型节点
2. 调用 `download_figma_images` 逐个导出为 SVG
3. 保存到 `public/images/icons/` 目录
4. 告诉你导出了哪些文件

### 示例 3：修改现有组件并验证

```
你：
消息气泡的圆角应该是 16px 而不是 12px，请修复并验证
```

Claude 会：
1. 找到相关组件代码
2. 修改 border-radius
3. 用 Playwright 截图验证
4. 对比确认修复正确

---

## 9. 常见问题

### Q: MCP server 启动失败 / 连接超时

**可能原因**：网络问题导致 `npx` 无法下载 MCP server 包。

**解决方案**：预先全局安装：

```bash
npm install -g @anthropic-ai/figma-mcp @playwright/mcp
```

然后修改 `.mcp.json`，将 `command` 改为绝对路径：

```json
{
  "mcpServers": {
    "figma": {
      "command": "figma-mcp",
      "args": [],
      "env": {
        "FIGMA_ACCESS_TOKEN": "<token>"
      }
    },
    "playwright": {
      "command": "playwright-mcp",
      "args": []
    }
  }
}
```

### Q: Playwright 浏览器没有安装

如果 Claude 在使用 Playwright 时报错找不到浏览器，运行：

```bash
npx playwright install chromium
```

或者在 Claude Code 中直接说："请安装 Playwright 浏览器"，Claude 会调用 `browser_install` 工具自动安装。

### Q: Figma token 过期 / 403 错误

重新生成 token（[步骤见第 5 节](#5-获取-figma-access-token)），更新 `.mcp.json` 中的值，重启 Claude Code。

### Q: 截图和 Figma 设计稿有色差

这通常是因为：
- Figma 使用的颜色配置（sRGB vs Display P3）与浏览器不同
- 字体未加载完成就截图了

**解决方案**：
- 确保使用 hex 颜色值而非 Figma 的 RGBA
- 截图前加载等待：让 Claude 等待页面完全渲染后再截图

### Q: 可以在 Cursor / VS Code 里用吗？

可以。Cursor 和 VS Code 的 Claude 扩展也支持 MCP 配置，格式相同。在项目根目录放 `.mcp.json` 即可被 Cursor 识别。

### Q: `.mcp.json` 不小心提交到了 git

```bash
# 从 git 历史中删除（包含 token，需要清理）
git rm --cached .mcp.json
echo ".mcp.json" >> .gitignore
git commit -m "Remove .mcp.json from tracking"

# 如果已经 push，token 已泄露，立即去 Figma 废弃旧 token 并生成新的
```

### Q: Claude Code 没有自动读取 CLAUDE.md

确保文件名是 `CLAUDE.md`（大写），且位于项目根目录。Claude Code 启动时会自动检测并加载。

你也可以在 Claude Code 中输入 `/init` 来重新初始化项目上下文。

---

## 附录：项目 MCP 配置速查

### 最小可用的 `.mcp.json`

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/figma-mcp@latest"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_xxxxx"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

### Claude Code 常用命令

| 命令 | 作用 |
|------|------|
| `claude` | 在当前目录启动 Claude Code |
| `/mcp` | 查看 MCP server 连接状态 |
| `/init` | 重新初始化项目上下文 |
| `/compact` | 压缩对话历史（对话太长时用） |
| `/clear` | 清空对话 |
| `/help` | 查看帮助 |

### MCP 工具速查

| 工具 | 来源 | 作用 |
|------|------|------|
| `get_figma_data` | Figma MCP | 获取 Figma 文件/节点的完整数据（布局、样式、文本） |
| `download_figma_images` | Figma MCP | 从 Figma 导出 SVG/PNG 图片 |
| `browser_navigate` | Playwright MCP | 在浏览器中打开 URL |
| `browser_resize` | Playwright MCP | 调整浏览器窗口大小 |
| `browser_take_screenshot` | Playwright MCP | 截取页面截图 |
| `browser_snapshot` | Playwright MCP | 获取页面可访问性快照（用于理解页面结构） |
| `browser_click` | Playwright MCP | 点击页面元素 |
| `browser_type` | Playwright MCP | 在输入框中输入文字 |
| `browser_evaluate` | Playwright MCP | 在页面中执行 JavaScript |
