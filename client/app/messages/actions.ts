'use server';

import { verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export type OtherUser = {
  id: number;
  name: string | null;
  gamerTag: string | null;
  email: string;
  avatarUrl: string | null;
};

export type MessageData = {
  id: number;
  content: string;
  createdAt: Date;
  senderId: number;
  recipientId: number;
  instanceId: number;
};

export type InstanceWithData = {
  id: number;
  createdAt: Date;
  senderId: number;
  receiverId: number;
  messages: MessageData[];
  otherUser: OtherUser;
};

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("tm_auth")?.value ?? null;
  const payload = verifyAuthToken(token);
  if (!payload) return null;
  return Number(payload.sub);
}

export async function getMessageInstances(): Promise<{
  instances: InstanceWithData[];
  currentUserId: number | null;
  error?: string;
}> {
  const userId = await getCurrentUserId();
  if (!userId) return { instances: [], currentUserId: null, error: "Unauthorized" };

  const instances = await prisma.messageInstance.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const otherUserIds = [
    ...new Set(
      instances.map((i) => (i.senderId === userId ? i.receiverId : i.senderId))
    ),
  ];

  const otherUsers = await prisma.user.findMany({
    where: { id: { in: otherUserIds } },
    select: { id: true, name: true, gamerTag: true, email: true, avatarUrl: true },
  });

  const userMap = new Map(otherUsers.map((u) => [u.id, u]));

  const instancesWithData: InstanceWithData[] = instances.map((instance) => {
    const otherUserId =
      instance.senderId === userId ? instance.receiverId : instance.senderId;
    const otherUser = userMap.get(otherUserId) ?? {
      id: otherUserId,
      name: null,
      gamerTag: null,
      email: "Unknown",
      avatarUrl: null,
    };
    return { ...instance, otherUser };
  });

  return { instances: instancesWithData, currentUserId: userId };
}

export async function sendMessage(instanceId: number, content: string) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  const instance = await prisma.messageInstance.findUnique({
    where: { id: instanceId },
  });

  if (!instance) return { error: "Instance not found" };
  if (instance.senderId !== userId && instance.receiverId !== userId) {
    return { error: "Forbidden" };
  }

  const recipientId =
    instance.senderId === userId ? instance.receiverId : instance.senderId;

  const message = await prisma.message.create({
    data: { content, senderId: userId, recipientId, instanceId },
  });

  return { success: true, message };
}

export async function startConversation(recipientId: number, content: string) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };
  if (!content.trim()) return { error: "Message cannot be empty" };

  const instance = await prisma.messageInstance.create({
    data: { senderId: userId, receiverId: recipientId },
  });

  const message = await prisma.message.create({
    data: { content, senderId: userId, recipientId, instanceId: instance.id },
  });

  return { success: true, instanceId: instance.id, message };
}
