// client/app/api/invites/route.ts
import { NextResponse } from "next/server";
import { createInviteService } from "../../serverActions/inviteService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipientId, content } = body ?? {};

    const invite = await createInviteService({ req, recipientId, content });
    return NextResponse.json(invite, { status: 201 });
  } catch (err: any) {
    console.error("Invite create error:", err);

    switch (err?.message) {
      case "UNAUTHORIZED":
        return new NextResponse("Unauthorized", { status: 401 });

      case "INVALID_RECIPIENT":
      case "INVALID_CONTENT":
        return new NextResponse("Invalid payload", { status: 400 });

      case "CANNOT_INVITE_SELF":
        return new NextResponse("Cannot invite yourself", { status: 400 });

      case "RECIPIENT_NOT_FOUND":
        return new NextResponse("Recipient not found", { status: 404 });

      case "PENDING_INVITE_EXISTS":
        return new NextResponse("Pending invite already exists", { status: 409 });

      default:
        return new NextResponse("Server error", { status: 500 });
    }
  }
}
