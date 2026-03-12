import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

export async function POST(request: Request, {}) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_CONNECTION_KEY,
  });
  try {
    const quiz = await prisma.quiz.create({
      data: {
        id: Date.now().toString(),
        question: "",
        options: ["", ""],
        answer: "",
        articleId: "",
      },
    });
    return NextResponse.json(
      { message: "Quiz created successfully!" },
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse("Not available to write quiz!", { status: 401 });
  }
}
