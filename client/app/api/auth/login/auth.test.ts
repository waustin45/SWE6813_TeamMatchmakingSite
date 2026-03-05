import * as authLib from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET as profileRoute } from "../profile/route";
import { POST as signupRoute } from "../signup/route";
import { POST as loginRoute } from "./route";

// Mock dependencies
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({
  getTokenFromRequest: vi.fn(),
  verifyAuthToken: vi.fn(),
  setAuthCookie: vi.fn(),
}));

describe("Auth API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/signup", () => {
    it("should return 400 if email or password is missing", async () => {
      const req = new Request("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email: "" }),
      });
      const res = await signupRoute(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toBe("Email and password required");
    });

    it("should return 409 if email already exists", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ id: 1, email: "test@test.com" });
      
      const req = new Request("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email: "test@test.com", password: "password" }),
      });
      const res = await signupRoute(req);
      expect(res.status).toBe(409);
    });

    it("should create a user and return 201 on success", async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);
      (bcrypt.hash as any).mockResolvedValue("hashed_pw");
      (prisma.user.create as any).mockResolvedValue({ 
        id: 1, 
        email: "new@test.com", 
        name: "New User", 
        gamerTag: "Gamer" 
      });

      const req = new Request("http://localhost/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ 
          email: "new@test.com", 
          password: "password",
          name: "New User",
          gamerTag: "Gamer"
        }),
      });
      
      const res = await signupRoute(req);
      expect(res.status).toBe(201);
      expect(prisma.user.create).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 401 for invalid credentials (user not found)", async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      const req = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "missing@test.com", password: "password" }),
      });
      const res = await loginRoute(req);
      expect(res.status).toBe(401);
    });

    it("should return 401 for invalid credentials (wrong password)", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ 
        id: 1, 
        email: "test@test.com", 
        passwordHash: "hashed_pw" 
      });
      (bcrypt.compare as any).mockResolvedValue(false);

      const req = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "test@test.com", password: "wrong" }),
      });
      const res = await loginRoute(req);
      expect(res.status).toBe(401);
    });

    it("should return 200 and set cookie on success", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({ 
        id: 1, 
        email: "test@test.com", 
        passwordHash: "hashed_pw" 
      });
      (bcrypt.compare as any).mockResolvedValue(true);
      (jwt.sign as any).mockReturnValue("mock_token");

      const req = new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "test@test.com", password: "correct" }),
      });
      const res = await loginRoute(req);
      
      expect(res.status).toBe(200);
      expect(authLib.setAuthCookie).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
    });
  });

  describe("GET /api/auth/profile", () => {
    it("should return 401 if token is invalid or missing", async () => {
      (authLib.getTokenFromRequest as any).mockReturnValue(null);
      (authLib.verifyAuthToken as any).mockReturnValue(null);

      const req = new Request("http://localhost/api/auth/profile");
      const res = await profileRoute(req);
      expect(res.status).toBe(401);
    });

    it("should return 200 and user data if authorized", async () => {
      (authLib.getTokenFromRequest as any).mockReturnValue("valid_token");
      (authLib.verifyAuthToken as any).mockReturnValue({ sub: "1" });
      (prisma.user.findUnique as any).mockResolvedValue({ 
        id: 1, 
        email: "test@test.com",
        name: "Test",
        gamerTag: "Tag"
      });

      const req = new Request("http://localhost/api/auth/profile");
      const res = await profileRoute(req);
      expect(res.status).toBe(200);
      expect(await res.json()).toHaveProperty("user");
    });
  });
});