import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { OpenAI } from "openai";

export async function POST(req: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_CONNECTION_KEY });
  try {
    const article = await prisma.article.create({
      data: {
        title: "",
        content: "",
        summary: "",
        userId: "",
        id: Date.now().toString(),
      },
    });
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_CONNECTION_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        input: `Extract the dish name and ingredients from: "${prompt}",`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API error:", response.status, errorText);
      return NextResponse.json(
        { error: errorText },
        {
          status: response.status,
        },
      );
    }
    const data = await response.json();
    const text = data.output[0].content[0].text;
    const formattedText = text.replace(/\\n/g, "");
    await prisma.article.update({
      where: { id: article.id },
      data: { content: formattedText },
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
