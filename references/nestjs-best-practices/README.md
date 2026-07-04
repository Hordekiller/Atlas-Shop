# NestJS Best Practices — Reference

## Architecture
- Modular structure: feature modules (auth, products, orders) + shared modules (config, database)
- Services contain business logic, Controllers handle HTTP, Modules wire dependencies
- Use DTOs with `class-validator` for all inputs → validation pipe with `whitelist: true`

## ConfigModule Pattern
```typescript
import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  providers: [
    {
      provide: "CONFIG_VALIDATOR",
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const required = ["DATABASE_URL", "JWT_SECRET", "ENCRYPTION_KEY"];
        const missing = required.filter((key) => !config.get(key));
        if (missing.length) throw new Error(`Missing env vars: ${missing.join(", ")}`);
      },
    },
  ],
})
export class ConfigModule {}
```

## Exception Filter
```typescript
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case "P2002": // unique constraint
        return response.status(409).json({ statusCode: 409, message: "Resource already exists" });
      case "P2003": // foreign key
        return response.status(400).json({ statusCode: 400, message: "Related resource not found" });
      case "P2025": // not found
        return response.status(404).json({ statusCode: 404, message: "Resource not found" });
      default:
        return response.status(500).json({ statusCode: 500, message: "Internal server error" });
    }
  }
}
```

## Testing (Jest)
```typescript
// Unit test
const moduleRef = await Test.createTestingModule({
  providers: [UsersService, PrismaService],
}).compile();
const service = moduleRef.get<UsersService>(UsersService);

// E2E test with supertest
const app = moduleRef.createNestApplication();
await app.init();
return request(app.getHttpServer()).get("/users").expect(200);
```

## Best Practices Checklist
- [x] Global ValidationPipe with whitelist
- [x] DTOs for all endpoints
- [x] Exception filters (Prisma, generic)
- [x] ConfigModule with env validation
- [x] Logger for all catch blocks (never empty catch)
- [x] Guards for auth/roles (not manual checks)
- [x] Interceptors for response transformation
- [x] Swagger only in development
- [x] Rate limiting (ThrottlerGuard)
