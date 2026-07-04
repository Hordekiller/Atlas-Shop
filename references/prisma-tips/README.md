# Prisma Tips — Reference

## Schema Design
```prisma
// Always index foreign keys
model Post {
  id      String @id @default(cuid())
  userId  String
  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}

// Composite indexes for common query patterns
@@index([tenantId, deletedAt])
@@index([type, createdAt])

// Explicit many-to-many with extra fields
model TeamMember {
  userId String
  teamId String
  role   TeamRole @default(MEMBER)
  user   User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  team   Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  @@id([userId, teamId])
}
```

## Performance
- **Always use `select`** instead of returning all columns
- **Batch with `$transaction([...])`** — single round trip
- **Avoid N+1**: use `include` at top level or batch with `findMany({ where: { id: { in: ids } } })`
- **Prisma 5.7+**: `relationLoadStrategy: "join"` collapses relations to SQL JOINs
- **Cursor pagination** for large datasets (not skip/take)
- **Missing FK indexes**: the #1 performance bug — add `@@index` on every foreign key

## Migrations
```bash
# Development
npx prisma migrate dev --name init

# Production (CI/CD)
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Migration Safety
- **Never** edit a migration that has been deployed
- Adding `NOT NULL` to existing tables: add nullable → backfill → enforce NOT NULL
- Always version-control the `migrations/` folder
- `prisma migrate deploy` is idempotent (only applies pending)

## Connection Pooling
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Use pooler URL (PgBouncer / Prisma Accelerate) in production
  // DATABASE_URL="postgresql://user:pass@pooler:5432/db?pgbouncer=true&connection_limit=20"
}
```

## Testing with Prisma
```typescript
// Transaction rollback pattern for test isolation
export function createTransactionalTestContext(prisma: PrismaClient) {
  let tx: any;
  let rollback: () => void;

  return {
    get db() { return tx; },
    async begin() {
      await new Promise<void>((resolve, reject) => {
        prisma.$transaction(async (transaction) => {
          tx = transaction;
          resolve();
          await new Promise((_, reject) => { rollback = () => reject(new Error("rollback")); });
        }).catch((err) => { if (err.message !== "rollback") throw err; });
      });
    },
    async end() { rollback?.(); },
  };
}
```

## Connections for Atlas Shop
- ✅ `CartItem.variantId`: `Int?` (nullable, not magic 0)
- ✅ `WishlistItem.variantId`: same fix
- ✅ `PageRevision.contentJson`: `Json` type (not String)
- ✅ `Payment` has: `nonce String? @unique`, `verifiedAt DateTime?`
- ✅ CASCADE: Order→OrderItem, Review→User (SetNull), Review→Order (SetNull)
