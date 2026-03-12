import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";
import { NextRequest, NextResponse } from "next/server";

type Event = {
  type: string;
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses: { email_address: string }[];
  };
};

export async function POST(request: NextRequest) {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_KEY;

    if (!webhookSecret) {
      return NextResponse.json(
        { message: "Missing webhook secret!" },
        { status: 400 },
      );
    }

    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixSignature || !svixTimestamp) {
      return NextResponse.json({ message: "Error" }, { status: 400 });
    }

    const webhook = new Webhook(webhookSecret);
    const body = await request.text();

    try {
      const event = webhook.verify(body, {
        "svix-id": svixId,
        "svix-signature": svixSignature,
        "svix-timestamp": svixTimestamp,
      }) as Event;

      if (event.type !== "user.created") {
        return NextResponse.json({ message: "Ignore event" }, { status: 400 });
      }

      const { email_addresses, first_name, last_name, id } = event.data;

      await prisma.user.create({
        data: {
          id,
          clerkId: "",
          email: email_addresses[0].email_address,
          name: `${first_name} ${last_name}`,
        },
      });

      return NextResponse.json(
        { message: "Article made up successfully!" },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid Signature!" },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Not available to search!" },
      { status: 400 },
    );
  }
}
