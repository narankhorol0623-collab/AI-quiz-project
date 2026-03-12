import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const existingUser = request.body;
  if (!existingUser) {
    return NextResponse.json(
      { message: "You have to sign up first!" },
      { status: 401 },
    );
  } else {
    
  }
}
