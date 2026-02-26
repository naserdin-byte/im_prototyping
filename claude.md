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
| Node.js | **≥ 18.18.0** | Next.js 16 minimum; Vercel default runtime |
| npm | **≥ 9** (lockfileVersion 3) | Matches the existing `package-lock.json` format |

Add the `engines` field in `package.json` if it doesn't exist:

```json
"engines": {
  "node": ">=18.18.0",
  "npm": ">=9"
}
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
