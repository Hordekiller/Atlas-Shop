import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule, ConfigService } from "@nestjs/config";

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
      useFactory: (configService: ConfigService) => {
        const requiredVars = ["DATABASE_URL", "JWT_SECRET", "ENCRYPTION_KEY"];
        const missing = requiredVars.filter(
          (key) => !configService.get<string>(key),
        );
        if (missing.length > 0) {
          throw new Error(
            `Missing required environment variables: ${missing.join(", ")}`,
          );
        }
        return true;
      },
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
