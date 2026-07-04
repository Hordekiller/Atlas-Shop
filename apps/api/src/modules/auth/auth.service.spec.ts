import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { PrismaService } from "@/common/prisma.service";
import { OtpService } from "../otp/otp.service";

describe("AuthService", () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    address: {
      create: jest.fn(),
    },
    siteConfig: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue("mock-token"),
  };

  const mockOtpService = {
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: OtpService, useValue: mockOtpService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    it("should throw on invalid credentials", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login("test@test.com", "wrong"),
      ).rejects.toThrow();
    });

    it("should return user and token on valid login", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        password: "$2a$12$hashedpassword",
        name: "Test User",
        role: "CUSTOMER",
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const bcrypt = await import("bcryptjs");
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      const result = await service.login("test@test.com", "password");

      expect(result).toHaveProperty("token");
      expect(result.user).not.toHaveProperty("password");
    });
  });
});
