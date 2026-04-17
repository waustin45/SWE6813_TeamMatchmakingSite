import * as authLib from "@/lib/auth";
import prisma from "@/lib/prisma";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { getGamesTagsData, saveGamesAndTags } from "./gamesTagsActions";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  verifyAuthToken: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    game: { findMany: vi.fn() },
    tag: { findMany: vi.fn() },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { cookies } from "next/headers";

function mockCookieWithToken(token: string | null) {
  (cookies as Mock).mockResolvedValue({
    get: (name: string) => (name === "tm_auth" && token ? { value: token } : undefined),
  });
}

describe("gamesTagsActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getGamesTagsData", () => {
    const mockGames = [
      { id: 1, name: "Valorant", genres: [{ id: 1, name: "FPS" }] },
    ];
    const mockTags = [{ id: 1, name: "Competitive" }];

    it("returns all games, tags, and empty saved IDs when not authenticated", async () => {
      mockCookieWithToken(null);
      (authLib.verifyAuthToken as Mock).mockReturnValue(null);
      (prisma.game.findMany as Mock).mockResolvedValue(mockGames);
      (prisma.tag.findMany as Mock).mockResolvedValue(mockTags);

      const result = await getGamesTagsData();

      expect(result.allGames).toEqual(mockGames);
      expect(result.allTags).toEqual(mockTags);
      expect(result.savedGameIds).toEqual([]);
      expect(result.savedTagIds).toEqual([]);
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it("returns saved game and tag IDs for authenticated user", async () => {
      mockCookieWithToken("valid_token");
      (authLib.verifyAuthToken as Mock).mockReturnValue({ sub: "42" });
      (prisma.game.findMany as Mock).mockResolvedValue(mockGames);
      (prisma.tag.findMany as Mock).mockResolvedValue(mockTags);
      (prisma.user.findUnique as Mock).mockResolvedValue({
        id: 42,
        games: [{ id: 1 }],
        tags: [{ id: 1 }],
      });

      const result = await getGamesTagsData();

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 42 },
        include: { games: true, tags: true },
      });
      expect(result.savedGameIds).toEqual([1]);
      expect(result.savedTagIds).toEqual([1]);
    });

    it("returns empty saved IDs when authenticated user has no saved games/tags", async () => {
      mockCookieWithToken("valid_token");
      (authLib.verifyAuthToken as Mock).mockReturnValue({ sub: "42" });
      (prisma.game.findMany as Mock).mockResolvedValue(mockGames);
      (prisma.tag.findMany as Mock).mockResolvedValue(mockTags);
      (prisma.user.findUnique as Mock).mockResolvedValue({
        id: 42,
        games: [],
        tags: [],
      });

      const result = await getGamesTagsData();

      expect(result.savedGameIds).toEqual([]);
      expect(result.savedTagIds).toEqual([]);
    });

    it("returns empty saved IDs when authenticated user is not found in DB", async () => {
      mockCookieWithToken("valid_token");
      (authLib.verifyAuthToken as Mock).mockReturnValue({ sub: "99" });
      (prisma.game.findMany as Mock).mockResolvedValue(mockGames);
      (prisma.tag.findMany as Mock).mockResolvedValue(mockTags);
      (prisma.user.findUnique as Mock).mockResolvedValue(null);

      const result = await getGamesTagsData();

      expect(result.savedGameIds).toEqual([]);
      expect(result.savedTagIds).toEqual([]);
    });
  });

  describe("saveGamesAndTags", () => {
    it("returns error when not authenticated", async () => {
      mockCookieWithToken(null);
      (authLib.verifyAuthToken as Mock).mockReturnValue(null);

      const result = await saveGamesAndTags([1, 2], [3]);

      expect(result).toEqual({ error: "Unauthorized" });
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it("updates games and tags for authenticated user", async () => {
      mockCookieWithToken("valid_token");
      (authLib.verifyAuthToken as Mock).mockReturnValue({ sub: "42" });
      (prisma.user.update as Mock).mockResolvedValue({});

      const result = await saveGamesAndTags([1, 2], [3, 4]);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 42 },
        data: {
          games: { set: [{ id: 1 }, { id: 2 }] },
          tags: { set: [{ id: 3 }, { id: 4 }] },
        },
      });
      expect(result).toEqual({ success: true });
    });

    it("updates with empty arrays when no selections are provided", async () => {
      mockCookieWithToken("valid_token");
      (authLib.verifyAuthToken as Mock).mockReturnValue({ sub: "42" });
      (prisma.user.update as Mock).mockResolvedValue({});

      const result = await saveGamesAndTags([], []);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 42 },
        data: {
          games: { set: [] },
          tags: { set: [] },
        },
      });
      expect(result).toEqual({ success: true });
    });
  });
});
