# Project Guidelines

## Layout Scaling Rule

All pages use a **design-width-based proportional scaling** strategy to ensure pixel-perfect rendering across any screen size.

- **Design width**: `390px` (iPhone standard)
- **Scale factor**: `scale = viewportWidth / 390`
- **Design height**: `designHeight = viewportHeight / scale`
- **Transform origin**: `top left`

The page is rendered at a fixed 390px width with all elements at design-time sizes, then `transform: scale()` is applied to the outer container to fit the viewport. This keeps all text, spacing, icons, and proportions exactly matching the design spec.

```tsx
const DESIGN_WIDTH = 390;

const scale = window.innerWidth / DESIGN_WIDTH;
const designHeight = window.innerHeight / scale;

<div style={{
  width: DESIGN_WIDTH,
  height: designHeight,
  transform: `scale(${scale})`,
  transformOrigin: "top left",
}}>
```

**Do not** use responsive breakpoints or fluid sizing (e.g. `max-w-[480px]`, percentage widths) for page layout. All new pages should follow this scaling pattern.

## Images

**禁止使用 `next/image`（`<Image>`）**，统一使用原生 `<img>` 标签。

原因：`next/image` 会把图片路由到 `/_next/image?url=...&w=...&q=...` 优化 API，每个尺寸/质量组合生成不同 URL，导致我们在 `next.config.ts` 中为 `/images/*` 设置的长期缓存头完全失效。对于 390px 固定设计宽度的 prototype，图片优化没有必要。

```tsx
// GOOD — 直接引用 public/ 下的资源，走 CDN 缓存
<img src="/images/icons/icon-flag.svg" alt="Flag" style={{ width: 24, height: 24 }} />

// BAD — 走 /_next/image 优化 API，缓存失效
import Image from "next/image";
<Image src="/images/icons/icon-flag.svg" alt="Flag" width={24} height={24} />
```

使用 `<img>` 时需加 eslint disable 注释：
```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src="..." alt="..." />
```

## Icons & Assets

**严格从 Figma 设计稿导出 SVG/PNG，禁止自己手写或编造图标。**

- 所有图标必须通过 Figma MCP 工具从设计稿中导出，保留原始 path data
- **不要**自己凭感觉画 SVG path、拼凑图标、或用 placeholder 替代
- 如果 Figma 中图标是矢量（Vector），导出为 SVG
- 如果 Figma 中图标是光栅化的（rasterized / flattened），导出为 PNG（建议 3x）
- 导出后放入 `public/images/icons/` 目录

## Figma 还原原则：导出 vs 实现

**只有设计稿中本身就是图片资源（icon / illustration / photo）的节点才导出为 SVG/PNG。**
**UI 布局、文本、列表、网格等必须用代码实现，严禁整块截图当组件用。**

判断标准：

| Figma 节点类型 | 处理方式 | 示例 |
|---|---|---|
| Vector / SVG icon | 导出 SVG | 返回箭头、emoji 图标、tab bar icon |
| 光栅化图片（photo / sticker） | 导出 PNG（3x） | 头像、贴纸、封面图 |
| 文本 + 布局组合 | **代码实现** | 聊天气泡、输入栏、导航栏、列表 |
| 含多个子元素的 Frame | **代码实现**，子元素中的图片单独导出 | 贴纸网格 → 代码写 grid，单个贴纸导出 PNG |

**反面案例（禁止）：**
```
❌ 把一整行贴纸导出为一张 PNG，然后 <img> 展示 → 不可交互
❌ 把 tab bar 导出为一张图 → 无法切换 tab
❌ 把聊天输入栏截图当组件 → 无法输入文字
```

**正确做法：**
```
✅ 贴纸网格：代码实现 grid 布局，每个贴纸单独从 Figma 导出 PNG
✅ Tab bar：代码实现按钮布局，每个 icon 从 Figma 导出 SVG
✅ 输入栏：代码实现 flex 布局 + <input>，camera/emoji 等 icon 导出 SVG
```

## Animations

All animations use **[motion](https://motion.dev)** (package: `motion`, import from `"motion/react"`).

### Import convention

```tsx
import { motion, AnimatePresence } from "motion/react";
```

- Use `<motion.div>` / `<motion.button>` etc. for animated elements.
- Wrap conditionally rendered animated elements with `<AnimatePresence>` for exit animations.
- Always add a stable `key` prop when the animated element can swap (e.g. reaction emoji changing).

### Spring presets

Use spring physics for all interactive / UI animations. **不要使用** ease / cubic-bezier 缓动。

```ts
// Fast & snappy — buttons, pills, pop-in elements
const springPop = { type: "spring", stiffness: 700, damping: 35 };

// Slightly softer — panels, cards, context menus
const springGentle = { type: "spring", stiffness: 600, damping: 32 };
```

### Timing guidelines

| Category | Duration / Delay | Notes |
|---|---|---|
| Backdrop fade (overlay) | `duration: 0.15` | 简短的 tween，不用 spring |
| Panel enter/exit | Use `springPop` | scale + y offset |
| Staggered children | `delay: 0.02 * index` | 每个子元素间隔 20ms |
| Secondary panel delay | `delay: 0.02` | context menu 等略微延迟 |
| Reaction pill pop | `springPop` (stiffness 700, damping 30) | scale from 0.3, transformOrigin 在 bubble 角落 |

### Common patterns

```tsx
// Overlay backdrop (tween, not spring)
<motion.div
  initial={{ backgroundColor: "rgba(0,0,0,0)" }}
  animate={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
  exit={{ backgroundColor: "rgba(0,0,0,0)" }}
  transition={{ duration: 0.15 }}
/>

// Panel scale-in
<motion.div
  initial={{ opacity: 0, scale: 0.85, y: -12 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.85, y: -12 }}
  transition={springPop}
/>

// Pill pop-in with AnimatePresence
<AnimatePresence>
  {value && (
    <motion.div
      key={value}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ type: "spring", stiffness: 700, damping: 30 }}
    />
  )}
</AnimatePresence>

// Tap feedback
<motion.button whileTap={{ scale: 1.35 }} />
```

## UI 验证流程（必须执行）

每次修改 UI 后，**必须**通过 Playwright 截图验证渲染结果，确认无误后再继续。

### 步骤

1. **启动 dev server**（如未运行）
2. **设置手机视口尺寸**：`browser_resize` → width: 390, height: 844（iPhone 14/15 标准尺寸）
3. **用 Playwright 导航到目标页面**：`browser_navigate` → `http://localhost:3000`
4. **截图验证**：`browser_take_screenshot` 截取当前视口
5. **逐项检查**截图是否与预期一致（布局、间距、颜色、文字、图标）
6. **如有多个页面/状态受影响**，逐一导航并截图（如 Inbox → Chat → 长按 → Emoji 面板）
7. **确认无误后**，将截图移入 `.screenshots/`：`mv *.png .screenshots/`
8. **如发现问题**，修复后重新截图验证，直到正确

### 规则

- **必须使用手机尺寸验证** — 先 `browser_resize` 到 390×844，再截图。本项目是移动端 prototype，桌面宽度下的截图没有参考价值
- **不要**跳过验证直接提交 — UI 改动必须有截图确认
- **不要**将截图提交到 git — `.screenshots/` 已在 `.gitignore` 中
- 截图文件统一存放在 **`.screenshots/`** 目录
- 用 Playwright `browser_take_screenshot` 截图时，文件默认保存到项目根目录，验证后移走


## NPM / Node Version & Registry

This project deploys on **v0 / Vercel**. To ensure compatibility:

### Version constraints

| Tool | Required | Reason |
|------|----------|--------|
| Node.js | **≥ 20** | 本地推荐 20.x LTS；v0 sandbox 运行 24.x，需兼容两者 |
| npm | **≥ 10** (lockfileVersion 3) | Node 20.x 自带 npm 10.x，匹配 `package-lock.json` 格式 |

Add the `engines` field in `package.json` if it doesn't exist:

```json
"engines": {
  "node": ">=20",
  "npm": ">=10"
}
```

### v0 sandbox workaround

v0 sandbox 的架构会导致 `next dev` 在**错误的目录**启动：

| 目录 | 用途 |
|------|------|
| `/vercel/share/v0-next-shadcn/` | 共享模板，v0 默认在此运行 `npm run dev` |
| `/vercel/share/v0-project/` | 我们的实际项目代码（从 GitHub 同步） |

v0 在共享模板目录运行 `next dev`，但我们的 `src/app/page.tsx` 在项目目录，
导致 Next.js 扫描不到任何路由 → 所有页面 404。

`package.json` 中的 `predev` + `dev` 脚本自动处理：

```json
"predev": "if [ -d /vercel/share/v0-project/src ]; then npm install --prefix /vercel/share/v0-project; fi",
"dev": "if [ -d /vercel/share/v0-project/src ]; then cd /vercel/share/v0-project && exec ./node_modules/.bin/next dev; else next dev; fi"
```

- **`predev`**: 检测 v0 环境，在项目目录安装依赖
- **`dev`**: `cd` 到项目目录再启动 `next dev`，确保 Turbopack 扫描正确的 `src/app/`
- **本地开发不受影响**：检测不到 `/vercel/share/v0-project/src`，直接走 `else next dev`

### Public registry

Always use the **public npm registry** to avoid lockfile pollution from internal registries:

```bash
npm install --registry=https://registry.npmjs.org
```

This ensures `package-lock.json` contains public `resolved` URLs, which is required for v0/Vercel deployment to work correctly.

### Adding new dependencies

When adding any new package, always run:

```bash
npm install <package> --registry=https://registry.npmjs.org
```

After installing, verify no internal URLs leaked into the lockfile:

```bash
grep -c "registry.npmmirror\|bytedance\|bnpm" package-lock.json
# Should output: 0
```

## Figma 还原工作流（强制）

从 Figma 设计稿实现 UI 时，**必须**按以下步骤执行：

1. **先用 `get_figma_data` 拉取完整节点树**，逐层阅读每个节点的 layout 属性（mode、alignItems、alignSelf、justifyContent、gap、padding、sizing）
2. **把 Figma 的父子嵌套结构 1:1 映射到代码的 DOM 结构**。Figma 是两层容器就写两层 div，不要擅自合并或拆分层级
3. **逐个属性对照实现**：alignItems、alignSelf、gap、padding、sizing 每个都要对上，不要凭感觉写
4. **不要自作主张换布局方案**。Figma 写的是 row 就用 flex-direction: row，不要臆测换成 grid 或 column
5. **改完必须截图验证**，对照 Figma 确认无误
