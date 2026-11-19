
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { unstable_rethrow } from "next/navigation";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const payload = await verifySession(token);

    if (!payload || typeof payload.userId !== "string") {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    unstable_rethrow(error);
    console.error("Session verification error:", error);

    return NextResponse.json(
      { message: "Unable to verify session." },
      { status: 500 }
    );
  }
}
