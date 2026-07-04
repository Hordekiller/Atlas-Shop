import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { PrismaService } from "@/common/prisma.service";

describe("CategoriesService", () => {
  let service: CategoriesService;

  const mockPrisma = {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      updateMany: jest.fn(),
    },
    product: {
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    _count: { products: 0, children: 0 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return all categories with counts", async () => {
      const categories = [
        { id: 1, name: "Cat 1", _count: { products: 5, children: 2 } },
      ];
      mockPrisma.category.findMany.mockResolvedValue(categories);

      const result = await service.findAll();
      expect(result).toEqual(categories);
      expect(mockPrisma.category.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { sortOrder: "asc" } }),
      );
    });
  });

  describe("findTree", () => {
    it("should build category tree", async () => {
      mockPrisma.category.findMany.mockResolvedValue([
        { id: 1, name: "Root", parentId: null, _count: { products: 3 } },
        { id: 2, name: "Child", parentId: 1, _count: { products: 1 } },
        { id: 3, name: "Orphan", parentId: null, _count: { products: 0 } },
      ]);

      const tree = await service.findTree();
      expect(tree).toHaveLength(2); // 2 roots
      expect(tree[0].children).toHaveLength(1); // Root has 1 child
      expect(tree[0].children[0].name).toBe("Child");
    });
  });

  describe("findById", () => {
    it("should return category by id", async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 1, name: "Test" });
      const result = await service.findById(1);
      expect(result).toHaveProperty("name", "Test");
    });

    it("should throw on not found", async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("should create a category", async () => {
      mockPrisma.category.create.mockResolvedValue({ id: 1, name: "New Cat", slug: "new-cat" });

      const result = await service.create({ title: "New Cat" } as any);
      expect(result).toHaveProperty("id", 1);
      expect(mockPrisma.category.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: { title: "New Cat" } }),
      );
    });

    it("should pass dto directly to prisma", async () => {
      const dto = { title: "Test" };
      mockPrisma.category.create.mockResolvedValue({ id: 1, ...dto });
      const result = await service.create(dto as any);
      expect(mockPrisma.category.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe("update", () => {
    it("should update a category", async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.category.update.mockResolvedValue({ id: 1, name: "Updated" });

      const result = await service.update(1, { title: "Updated" } as any);
      expect(result.name).toBe("Updated");
    });
  });

  describe("remove", () => {
    it("should throw when category has products", async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.product.count.mockResolvedValue(5);
      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });

    it("should delete empty category", async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.product.count.mockResolvedValue(0);
      mockPrisma.category.updateMany.mockResolvedValue({ count: 0 });
      mockPrisma.category.delete.mockResolvedValue({ id: 1 });

      await expect(service.remove(1)).resolves.not.toThrow();
    });
  });
});
