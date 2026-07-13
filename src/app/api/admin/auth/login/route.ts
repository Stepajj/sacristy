import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

type AttemptState = {
  count: number;
  firstAttemptAt: number;
};

const globalForLogin = globalThis as typeof globalThis & {
  __sacristyAdminLoginAttempts?: Map<string, AttemptState>;
};

const attempts =
  globalForLogin.__sacristyAdminLoginAttempts ??
  (globalForLogin.__sacristyAdminLoginAttempts = new Map<string, AttemptState>());

function getClientKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function resetExpiredAttempt(key: string, now: number) {
  const state = attempts.get(key);
  if (state && now - state.firstAttemptAt >= WINDOW_MS) {
    attempts.delete(key);
    return null;
  }

  return state || null;
}

function shouldUseSecureCookie(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  return forwardedProto === "https" || request.nextUrl.protocol === "https:";
}

function clearAdminCookie(response: NextResponse, request: NextRequest) {
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: shouldUseSecureCookie(request),
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
}

export async function POST(request: NextRequest) {
  const key = getClientKey(request);
  const now = Date.now();
  const current = resetExpiredAttempt(key, now);

  if (current && current.count >= MAX_ATTEMPTS) {
    const secondsLeft = Math.max(1, Math.ceil((WINDOW_MS - (now - current.firstAttemptAt)) / 1000));
    const response = NextResponse.json(
      {
        success: false,
        error: `Too many attempts. Try again in ${Math.ceil(secondsLeft / 60)} min.`,
        attemptsRemaining: 0,
        resetInSeconds: secondsLeft,
      },
      { status: 429 },
    );
    clearAdminCookie(response, request);
    return response;
  }

  try {
    const { password } = (await request.json()) as { password?: string };

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password required", attemptsRemaining: MAX_ATTEMPTS - (current?.count || 0) },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      orderBy: { id: "asc" },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Admin user is not configured" }, { status: 500 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      const nextCount = (current?.count || 0) + 1;
      attempts.set(key, {
        count: nextCount,
        firstAttemptAt: current?.firstAttemptAt || now,
      });

      const remaining = Math.max(0, MAX_ATTEMPTS - nextCount);
      const response = NextResponse.json(
        {
          success: false,
          error: remaining > 0 ? `Wrong password. ${remaining} attempts left.` : "Too many attempts. Try again later.",
          attemptsRemaining: remaining,
        },
        { status: remaining > 0 ? 401 : 429 },
      );
      clearAdminCookie(response, request);
      return response;
    }

    attempts.delete(key);

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: "admin",
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: shouldUseSecureCookie(request),
      sameSite: "strict",
      maxAge: 60 * 60 * 12,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[API][Admin][Auth] Login error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
