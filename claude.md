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
