import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { Request, Response } from "express";
import { PrismaService } from "./prisma.service";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cachedUntil = 0;
  private cacheEnabled = true;

  constructor(private readonly prisma?: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    await this.refreshCacheSetting();

    const publicPaths = [
      "/api/products",
      "/api/categories",
      "/api/slides/active",
      "/api/settings/public",
    ];

    const isPublicGet =
      publicPaths.some((p) => request.path.startsWith(p)) &&
      request.method === "GET";

    if (request.method !== "GET") {
      response.setHeader("Cache-Control", "no-store");
    } else if (!this.isCacheEnabled()) {
      response.setHeader("Cache-Control", "no-store");
    } else if (isPublicGet) {
      response.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    } else if (request.method === "GET" && !request.path.includes("/auth")) {
      response.setHeader("Cache-Control", "private, no-cache, must-revalidate");
    }

    return next.handle();
  }

  private isCacheEnabled() {
    const raw = process.env.CACHE_ENABLED;
    return (raw === undefined || raw === "true") && this.cacheEnabled;
  }

  private async refreshCacheSetting() {
    if (!this.prisma) return;

    const now = Date.now();
    if (now < this.cachedUntil) return;
    this.cachedUntil = now + 30_000;

    const settings = await this.prisma.shopSettings.findUnique({
      where: { id: "singleton" },
      select: { cacheEnabled: true },
    });
    this.cacheEnabled = settings?.cacheEnabled ?? true;
  }
}
