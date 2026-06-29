import { Injectable, NestMiddleware, ServiceUnavailableException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "./prisma.service";

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  private cachedUntil = 0;
  private isEnabled = false;
  private message = "فروشگاه موقتاً در حال تعمیرات است";

  constructor(private prisma: PrismaService) {}

  async use(request: Request, _response: Response, next: NextFunction) {
    if (request.method === "OPTIONS" || request.path.startsWith("/api/admin")) {
      return next();
    }

    await this.refreshSettings();

    if (!this.isEnabled) return next();

    const isAdminAuthCheck = request.path.startsWith("/api/auth");
    const isDocs = request.path.startsWith("/api/docs");
    if (isAdminAuthCheck || isDocs) return next();

    throw new ServiceUnavailableException(this.message);
  }

  private async refreshSettings() {
    const now = Date.now();
    if (now < this.cachedUntil) return;

    this.cachedUntil = now + 30_000;
    const settings = await this.prisma.shopSettings.findUnique({
      where: { id: "singleton" },
      select: { maintenanceMode: true, maintenanceMessage: true },
    });

    this.isEnabled = settings?.maintenanceMode ?? false;
    this.message =
      settings?.maintenanceMessage || "فروشگاه موقتاً در حال تعمیرات است";
  }
}
