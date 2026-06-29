import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async getMethods() {
    return this.prisma.shippingMethod.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  }

  async getMethod(slug: string) {
    return this.prisma.shippingMethod.findUnique({ where: { slug } });
  }

  async calculate(methodSlug: string, subtotal: number, weight?: number) {
    const method = await this.getMethod(methodSlug);
    if (!method) return { valid: false, method: methodSlug, baseCost: 0, weightCost: 0, totalCost: 0, estimatedDays: null };
    const cost = subtotal >= method.freeThreshold.toNumber() ? 0 : method.basePrice.toNumber();
    let weightCost = 0;
    if (weight && weight > 0 && method.weightCost.greaterThan(0)) {
      weightCost = Math.ceil(weight / 1000) * method.weightCost.toNumber();
    }
    return {
      valid: true,
      method: method.slug,
      name: method.name,
      baseCost: cost,
      weightCost,
      totalCost: cost + weightCost,
      estimatedDays: method.estimatedDays,
    };
  }
}
