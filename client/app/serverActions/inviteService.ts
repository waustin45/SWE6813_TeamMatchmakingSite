import prisma from "@/lib/prisma";
import { getUserFromSession } from "@/lib/auth";

export type CreateInviteInput = {
  req: Request;
  recipientId: number | string;
  content: string;
};

export async function createInviteService({ req, recipientId, content }: CreateInviteInput) {
  // Auth
  const user = await getUserFromSession(req);
  if (!user) throw new Error("UNAUTHORIZED");

  // Validate payload
  if (!recipientId) throw new Error("INVALID_RECIPIENT");
  const recipientIdNum = Number(recipientId);
  if (Number.isNaN(recipientIdNum)) throw new Error("INVALID_RECIPIENT");
  if (!content || typeof content !== "string" || content.trim().length === 0) throw new Error("INVALID_CONTENT");
  if (recipientIdNum === user.id) throw new Error("CANNOT_INVITE_SELF");

  // Ensure recipient exists
  const recipient = await prisma.user.findUnique({ where: { id: recipientIdNum }, select: { id: true } });
  if (!recipient) throw new Error("RECIPIENT_NOT_FOUND");

  // Ohecks for duplicates
  const existing = await prisma.invite.findFirst({
    where: { senderId: user.id, recipientId: recipientIdNum, status: "pending" },
  });
  if (existing) throw new Error("PENDING_INVITE_EXISTS");

  // Create invite and nested message atomically
  const invite = await prisma.invite.create({
    data: {
      sender: { connect: { id: user.id } },
      recipient: { connect: { id: recipientIdNum } },
      status: "pending",
      message: {
        create: {
          content: content.trim(),
          sender: { connect: { id: user.id } },
          recipient: { connect: { id: recipientIdNum } },
        },
      },
    },
    include: { message: true },
  });

  return invite;
}
