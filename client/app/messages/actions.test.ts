import * as authLib from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { getMessageInstances, sendMessage, startConversation } from "./actions";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  verifyAuthToken: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    messageInstance: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    message: {
      create: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
  },
}));

import { cookies } from "next/headers";

function mockAuth(userId: number | null) {
  const token = userId ? "valid_token" : null;
  (cookies as Mock).mockResolvedValue({
    get: (name: string) => (name === "tm_auth" && token ? { value: token } : undefined),
  });
  (authLib.verifyAuthToken as Mock).mockReturnValue(
    userId ? { sub: String(userId) } : null
  );
}

const NOW = new Date("2024-01-01T00:00:00Z");

describe("messages/actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  describe("getMessageInstances", () => {
    it("returns Unauthorized when not authenticated", async () => {
      mockAuth(null);

      const result = await getMessageInstances();

      expect(result).toEqual({ instances: [], currentUserId: null, error: "Unauthorized" });
      expect(prisma.messageInstance.findMany).not.toHaveBeenCalled();
    });

    it("returns instances with otherUser data for authenticated user", async () => {
      mockAuth(1);

      const mockInstances = [
        {
          id: 10,
          createdAt: NOW,
          senderId: 1,
          receiverId: 2,
          messages: [{ id: 100, content: "hi", createdAt: NOW, senderId: 1, recipientId: 2, instanceId: 10 }],
        },
      ];
      const mockOtherUsers = [
        { id: 2, name: "Alice", gamerTag: "alice99", email: "alice@test.com", avatarUrl: null },
      ];

      (prisma.messageInstance.findMany as Mock).mockResolvedValue(mockInstances);
      (prisma.user.findMany as Mock).mockResolvedValue(mockOtherUsers);

      const result = await getMessageInstances();

      expect(prisma.messageInstance.findMany).toHaveBeenCalledWith({
        where: { OR: [{ senderId: 1 }, { receiverId: 1 }] },
        include: { messages: { orderBy: { createdAt: "asc" } } },
        orderBy: { createdAt: "desc" },
      });
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { id: { in: [2] } },
        select: { id: true, name: true, gamerTag: true, email: true, avatarUrl: true },
      });
      expect(result.currentUserId).toBe(1);
      expect(result.instances).toHaveLength(1);
      expect(result.instances[0].otherUser).toEqual(mockOtherUsers[0]);
    });

    it("uses a fallback otherUser when the user is not found in DB", async () => {
      mockAuth(1);

      (prisma.messageInstance.findMany as Mock).mockResolvedValue([
        { id: 10, createdAt: NOW, senderId: 1, receiverId: 99, messages: [] },
      ]);
      (prisma.user.findMany as Mock).mockResolvedValue([]);

      const result = await getMessageInstances();

      expect(result.instances[0].otherUser).toEqual({
        id: 99,
        name: null,
        gamerTag: null,
        email: "Unknown",
        avatarUrl: null,
      });
    });

    it("resolves otherUser correctly when current user is the receiver", async () => {
      mockAuth(2);

      (prisma.messageInstance.findMany as Mock).mockResolvedValue([
        { id: 10, createdAt: NOW, senderId: 1, receiverId: 2, messages: [] },
      ]);
      (prisma.user.findMany as Mock).mockResolvedValue([
        { id: 1, name: "Bob", gamerTag: "bob", email: "bob@test.com", avatarUrl: null },
      ]);

      const result = await getMessageInstances();

      expect(result.instances[0].otherUser.id).toBe(1);
    });

    it("deduplicates otherUserIds when multiple instances share the same other user", async () => {
      mockAuth(1);

      (prisma.messageInstance.findMany as Mock).mockResolvedValue([
        { id: 10, createdAt: NOW, senderId: 1, receiverId: 2, messages: [] },
        { id: 11, createdAt: NOW, senderId: 1, receiverId: 2, messages: [] },
      ]);
      (prisma.user.findMany as Mock).mockResolvedValue([
        { id: 2, name: "Alice", gamerTag: "alice", email: "alice@test.com", avatarUrl: null },
      ]);

      await getMessageInstances();

      const callArgs = (prisma.user.findMany as Mock).mock.calls[0][0];
      expect(callArgs.where.id.in).toEqual([2]);
    });

    it("returns empty instances list when user has no conversations", async () => {
      mockAuth(1);
      (prisma.messageInstance.findMany as Mock).mockResolvedValue([]);
      (prisma.user.findMany as Mock).mockResolvedValue([]);

      const result = await getMessageInstances();

      expect(result.instances).toEqual([]);
      expect(result.currentUserId).toBe(1);
      expect(result.error).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  describe("sendMessage", () => {
    it("returns Unauthorized when not authenticated", async () => {
      mockAuth(null);

      const result = await sendMessage(10, "hello");

      expect(result).toEqual({ error: "Unauthorized" });
      expect(prisma.messageInstance.findUnique).not.toHaveBeenCalled();
    });

    it("returns error when instance is not found", async () => {
      mockAuth(1);
      (prisma.messageInstance.findUnique as Mock).mockResolvedValue(null);

      const result = await sendMessage(999, "hello");

      expect(result).toEqual({ error: "Instance not found" });
      expect(prisma.message.create).not.toHaveBeenCalled();
    });

    it("returns Forbidden when user is not a participant", async () => {
      mockAuth(1);
      (prisma.messageInstance.findUnique as Mock).mockResolvedValue({
        id: 10, senderId: 5, receiverId: 6,
      });

      const result = await sendMessage(10, "hello");

      expect(result).toEqual({ error: "Forbidden" });
      expect(prisma.message.create).not.toHaveBeenCalled();
    });

    it("creates message and returns it when sender sends", async () => {
      mockAuth(1);
      (prisma.messageInstance.findUnique as Mock).mockResolvedValue({
        id: 10, senderId: 1, receiverId: 2,
      });
      const mockMessage = { id: 50, content: "hello", senderId: 1, recipientId: 2, instanceId: 10, createdAt: NOW };
      (prisma.message.create as Mock).mockResolvedValue(mockMessage);

      const result = await sendMessage(10, "hello");

      expect(prisma.message.create).toHaveBeenCalledWith({
        data: { content: "hello", senderId: 1, recipientId: 2, instanceId: 10 },
      });
      expect(result).toEqual({ success: true, message: mockMessage });
    });

    it("creates message with correct recipientId when receiver replies", async () => {
      mockAuth(2);
      (prisma.messageInstance.findUnique as Mock).mockResolvedValue({
        id: 10, senderId: 1, receiverId: 2,
      });
      (prisma.message.create as Mock).mockResolvedValue({});

      await sendMessage(10, "reply");

      expect(prisma.message.create).toHaveBeenCalledWith({
        data: { content: "reply", senderId: 2, recipientId: 1, instanceId: 10 },
      });
    });
  });

  // ---------------------------------------------------------------------------
  describe("startConversation", () => {
    it("returns Unauthorized when not authenticated", async () => {
      mockAuth(null);

      const result = await startConversation(2, "hey");

      expect(result).toEqual({ error: "Unauthorized" });
      expect(prisma.messageInstance.create).not.toHaveBeenCalled();
    });

    it("returns error when content is empty or whitespace", async () => {
      mockAuth(1);

      expect(await startConversation(2, "")).toEqual({ error: "Message cannot be empty" });
      expect(await startConversation(2, "   ")).toEqual({ error: "Message cannot be empty" });
      expect(prisma.messageInstance.create).not.toHaveBeenCalled();
    });

    it("creates a message instance and first message", async () => {
      mockAuth(1);
      const mockInstance = { id: 20, senderId: 1, receiverId: 2, createdAt: NOW };
      const mockMessage = { id: 60, content: "hey", senderId: 1, recipientId: 2, instanceId: 20, createdAt: NOW };
      (prisma.messageInstance.create as Mock).mockResolvedValue(mockInstance);
      (prisma.message.create as Mock).mockResolvedValue(mockMessage);

      const result = await startConversation(2, "hey");

      expect(prisma.messageInstance.create).toHaveBeenCalledWith({
        data: { senderId: 1, receiverId: 2 },
      });
      expect(prisma.message.create).toHaveBeenCalledWith({
        data: { content: "hey", senderId: 1, recipientId: 2, instanceId: 20 },
      });
      expect(result).toEqual({ success: true, instanceId: 20, message: mockMessage });
    });
  });
});
