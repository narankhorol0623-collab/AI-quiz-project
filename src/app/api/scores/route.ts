import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const score = await prisma.userScore.create({
      data: {
        userId: "",
        quizId: "",
        score: 0,
      },
    });
    return NextResponse.json({ message: "Success!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid core!" }, { status: 400 });
  }
}

export async function GET(request: Request) {}
