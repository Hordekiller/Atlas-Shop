# CI/CD — Reference

## GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: atlas_shop_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"
      - run: npm ci
      - run: npx prisma generate -w @atlas-shop/api
      - run: npx prisma migrate deploy -w @atlas-shop/api
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/atlas_shop_test
      - run: npm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"
      - run: npm ci
      - run: npm run build
```

## Husky + Commitlint (Code Quality Gates)
```bash
# Install
npm install -D husky @commitlint/cli @commitlint/config-conventional lint-staged
npx husky init

# .husky/pre-commit
npx lint-staged

# .husky/commit-msg
npx --no -- commitlint --edit $1

# commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

## Conventional Commits
| Type     | Usage                          |
|----------|--------------------------------|
| feat     | New feature                    |
| fix      | Bug fix                        |
| chore    | Build/deps/CI                  |
| docs     | Documentation                  |
| refactor | Code change (no feature/bug)   |
| style    | Formatting only                |
| test     | Adding/updating tests          |
| perf     | Performance improvement        |
| security | Security fix                   |
| db       | Migration/schema change        |

## Branch Strategy
```
main        ← production-ready
  ├── develop   ← integration branch
  │   ├── feat/xxx
  │   ├── fix/xxx
  │   └── refactor/xxx
  └── hotfix/xxx  ← urgent production fixes
```

## Turborepo CI Optimization
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".turbo/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    }
  }
}
```

## For Atlas Shop
### Already in place
- ✅ GitHub Actions CI (lint + build + smoke test)
- ✅ ESLint with import ordering
- ✅ Turborepo build orchestration
- ✅ Docker Compose for local dev

### Missing / Future
- ❌ Automated test runs
- ❌ Husky pre-commit hooks
- ❌ Commitlint enforcement
- ❌ CD (auto-deploy on main merge)
- ❌ Prisma migrate deploy in CI
