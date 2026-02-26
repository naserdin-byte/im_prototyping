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

## Icons & Assets

**严格从 Figma 设计稿导出 SVG/PNG，禁止自己手写或编造图标。**

- 所有图标必须通过 Figma MCP 工具从设计稿中导出，保留原始 path data
- **不要**自己凭感觉画 SVG path、拼凑图标、或用 placeholder 替代
- 如果 Figma 中图标是矢量（Vector），导出为 SVG
- 如果 Figma 中图标是光栅化的（rasterized / flattened），导出为 PNG（建议 3x）
- 导出后放入 `public/images/icons/` 目录

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

## Screenshots

开发验证截图统一存放在 **`.screenshots/`** 目录，该目录已被 `.gitignore` 忽略，不会提交到仓库。

- 用 Playwright `browser_take_screenshot` 截图时，文件会保存到项目根目录
- 验证完成后，将截图移入 `.screenshots/`：`mv *.png .screenshots/`
- **不要**将截图提交到 git

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
