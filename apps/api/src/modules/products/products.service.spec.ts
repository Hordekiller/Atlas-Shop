import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { PrismaService } from "@/common/prisma.service";

describe("ProductsService", () => {
  let service: ProductsService;
  const tx: any = {};
  const mockPrisma = {
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    review: { aggregate: jest.fn() },
    category: { findUnique: jest.fn() },
    attributeDefinition: { createMany: jest.fn(), deleteMany: jest.fn() },
    productAttribute: { createMany: jest.fn(), deleteMany: jest.fn() },
    productVariant: { createMany: jest.fn(), deleteMany: jest.fn() },
    image: { createMany: jest.fn(), deleteMany: jest.fn() },
    $transaction: jest.fn((cb: any) => cb({ ...mockPrisma, ...tx })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return paginated products", async () => {
      const products = [{ id: 1, title: "Product 1" }];
      mockPrisma.product.findMany.mockResolvedValue(products);
      mockPrisma.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, take: 10 });
      expect(result.data).toEqual(products);
      expect(result.total).toBe(1);
    });

    it("should apply search filter", async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await service.findAll({ page: 1, take: 10, search: "test" });
      const callArgs = mockPrisma.product.findMany.mock.calls[0][0];
      expect(callArgs.where.AND).toBeDefined();
      const searchCond = callArgs.where.AND.find(
        (c: any) => c.OR && c.OR.some((o: any) => o.title?.contains === "test"),
      );
      expect(searchCond).toBeDefined();
    });
  });

  describe("findBySlug", () => {
    it("should return product by slug", async () => {
      const product = { id: 1, title: "Test", slug: "test" };
      mockPrisma.product.findUnique.mockResolvedValue(product);
      const result = await service.findBySlug("test");
      expect(result).toEqual(product);
    });

    it("should throw NotFoundException when not found", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);
      await expect(service.findBySlug("nonexistent")).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    const dto: any = { title: "New Product", categoryId: 1, price: 100000, stock: 10 };

    it("should create a product", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);
      mockPrisma.category.findUnique.mockResolvedValue({ id: 1, name: "Test" });
      mockPrisma.product.create.mockResolvedValue({ id: 1, ...dto, slug: "new-product" });

      const result = await service.create(dto);
      expect(result).toHaveProperty("id", 1);
    });

    it("should generate unique slug on conflict", async () => {
      mockPrisma.product.findUnique
        .mockResolvedValueOnce({ id: 2, slug: "new-product" })
        .mockResolvedValueOnce(null);
      mockPrisma.category.findUnique.mockResolvedValue({ id: 1, name: "Test" });
      mockPrisma.product.create.mockResolvedValue({ id: 1, ...dto, slug: "new-product-1" });

      const result = await service.create(dto);
      expect(result.slug).toBe("new-product-1");
    });
  });

  describe("update", () => {
    it("should update a product", async () => {
      const existing = { id: 1, title: "Old", slug: "old" };
      mockPrisma.product.findUnique.mockResolvedValue(existing);
      mockPrisma.product.update.mockResolvedValue({ ...existing, title: "New" });

      const result = await service.update(1, { title: "New" } as any);
      expect(result.title).toBe("New");
    });

    it("should throw on nonexistent product", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);
      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("should delete a product", async () => {
      mockPrisma.product.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.product.delete.mockResolvedValue({ id: 1 });
      await expect(service.remove(1)).resolves.not.toThrow();
    });

    it("should throw on nonexistent product", async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
