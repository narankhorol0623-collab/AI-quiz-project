import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question, options, answer, articleId } = await req.json();
  const openai = process.env.OPENAI_CONNECTION_KEY;
  try {
    if (!openai) {
      return NextResponse.json(
        { error: "Missing OpenAI API key" },
        { status: 500 },
      );
    }
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openai}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant for creating quiz questions based on the article content.",
          },
          {
            role: "user",
            content: `Create a quiz question based on the following article content:\n\n${articleId}\n\nQuestion: ${question}\nOptions: ${options.join(
              ", ",
            )}\nAnswer: ${answer}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return NextResponse.json(
        { error: errorText },
        {
          status: response.status,
        },
      );
    }

    const data = await response.json();
    const quizContent = data.choices[0].message.content;
    const quiz = await prisma.quiz.create({
      data: {
        id: Date.now().toString(),
        question: quizContent,
        options,
        answer,
        articleId,
      },
    });

    return NextResponse.json(
      { message: "Quiz created successfully", quiz },
      { status: 201 },
    );
  } catch (error) {
    return new Response("Not available to create quiz!", { status: 400 });
  }
}
