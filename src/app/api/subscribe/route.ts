import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string };
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("[subscribe] BREVO_API_KEY not set");
    return NextResponse.json({ ok: true });
  }

  const listId = Number(process.env.BREVO_LIST_ID);
  const body: { email: string; updateEnabled: boolean; listIds?: number[] } = {
    email: normalizedEmail,
    updateEnabled: true,
  };

  if (Number.isInteger(listId) && listId > 0) {
    body.listIds = [listId];
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[subscribe] Brevo error", response.status, errorBody);
    }
  } catch (error) {
    console.error("[subscribe] Fetch error", error instanceof Error ? error.message : error);
  }

  return NextResponse.json({ ok: true });
}
