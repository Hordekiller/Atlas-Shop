import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { PrismaService } from "@/common/prisma.service";
import { CouponsService } from "../coupons/coupons.service";
import { NotificationsService } from "../notifications/notifications.service";
import { EmailService } from "../email/email.service";
import { ShippingService } from "../shipping/shipping.service";

describe("OrdersService", () => {
  let service: OrdersService;

  const mockPrisma = {
    product: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    orderItem: { createMany: jest.fn() },
    address: { findUnique: jest.fn() },
    siteConfig: { findUnique: jest.fn() },
    shopSettings: { findUnique: jest.fn().mockResolvedValue(null) },
    $transaction: jest.fn((cb: any) => cb(mockPrisma)),
  };

  const mockCoupons = { validate: jest.fn(), apply: jest.fn() };
  const mockNotifications = { send: jest.fn(), create: jest.fn() };
  const mockEmail = { sendOrderConfirmation: jest.fn().mockResolvedValue({}) };
  const mockShipping = { calculate: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CouponsService, useValue: mockCoupons },
        { provide: NotificationsService, useValue: mockNotifications },
        { provide: EmailService, useValue: mockEmail },
        { provide: ShippingService, useValue: mockShipping },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    const validDto = {
      items: [{ productId: 1, quantity: 2 }],
      shippingMethod: "post",
      addressId: 1,
      agreedToTerms: true,
    };

    it("should throw when terms not agreed", async () => {
      await expect(
        service.create(1, { ...validDto, agreedToTerms: false }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw when product not found", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      await expect(service.create(1, validDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should create order successfully", async () => {
      const product = {
        id: 1,
        title: "Test",
        price: { toNumber: () => 100000 },
        salePrice: null,
        stock: 10,
        discountStartAt: null,
        discountEndAt: null,
      };
      mockPrisma.product.findMany.mockResolvedValue([product]);
      mockPrisma.product.findUnique.mockResolvedValue(product);
      mockPrisma.product.update.mockResolvedValue(product);
      mockPrisma.address.findUnique.mockResolvedValue({ id: 1, userId: 1 });
      mockPrisma.wallet = { findUnique: jest.fn().mockResolvedValue(null) };
      mockPrisma.stockMovement = { create: jest.fn().mockResolvedValue({}) };
      mockPrisma.orderItem = { createMany: jest.fn().mockResolvedValue({ count: 1 }) };
      mockPrisma.productVariant = { findUnique: jest.fn().mockResolvedValue(null), update: jest.fn() };
      mockPrisma.siteConfig = { findUnique: jest.fn().mockResolvedValue(null) };
      mockPrisma.notification = { create: jest.fn().mockResolvedValue({}) };
      mockPrisma.cartItem = { deleteMany: jest.fn().mockResolvedValue({ count: 0 }) };
      mockPrisma.user = { findUnique: jest.fn().mockResolvedValue({ id: 1, name: "Test", email: "test@test.com" }) };
      mockShipping.calculate.mockResolvedValue({ totalCost: 50000 });
      mockPrisma.order.create.mockResolvedValue({
        id: 1,
        total: 250000,
        status: "PENDING",
      });
      mockPrisma.$transaction.mockImplementation((cb: any) =>
        cb(mockPrisma),
      );

      const result = await service.create(1, validDto);
      expect(result).toHaveProperty("id", 1);
      expect(mockPrisma.order.create).toHaveBeenCalled();
    });
  });

  describe("getUserOrders", () => {
    it("should return user orders", async () => {
      const orders = [{ id: 1, userId: 1 }];
      mockPrisma.order.findMany.mockResolvedValue(orders);
      mockPrisma.order.count.mockResolvedValue(1);

      const result = await service.getUserOrders(1, 1, 20);
      expect(result.data).toEqual(orders);
    });
  });

  describe("findById", () => {
    it("should return order", async () => {
      mockPrisma.order.findUnique.mockResolvedValue({ id: 1 });
      const result = await service.findById(1);
      expect(result).toHaveProperty("id", 1);
    });
  });
});
