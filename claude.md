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

### v0 sandbox symlink workaround

v0 sandbox 会将 `node_modules` 符号链接到 `/vercel/share/v0-next-shadcn/node_modules`，
但 Next.js 16 的 Turbopack 不支持跨根 symlink，导致路由编译失败 (404)。

`package.json` 中的 `predev` 脚本会在 `npm run dev` 前自动检测并替换 symlink：

```json
"predev": "if [ -L node_modules ]; then rm node_modules && npm install --prefer-offline 2>/dev/null || npm install; fi"
```

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
