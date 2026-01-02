import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { persistLead, type LeadRecord } from "@/lib/leadStore";

type LeadPayload = {
  name?: string;
  email?: string;
  style?: string[] | string;
  fit?: string[] | string;
  budget?: string[] | string;
  notes?: string;
};

const requiredFields: Array<keyof LeadPayload> = ["name", "email"];

const friendlyNames: Record<keyof LeadPayload, string> = {
  name: "First name",
  email: "Email",
  style: "Style preferences",
  fit: "Wardrobe focus",
  budget: "Budget",
  notes: "Notes",
};

const toArray = (value: string | string[] | undefined) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const leadScore = (payload: LeadPayload) => {
  let score = 40;

  const style = toArray(payload.style);
  score += style.length * 6;

  if (style.includes("luxury") || style.includes("bold")) {
    score += 14;
  }

  const budget = toArray(payload.budget)[0];
  switch (budget) {
    case "over-600":
      score += 28;
      break;
    case "300-600":
      score += 20;
      break;
    case "150-300":
      score += 12;
      break;
    default:
      score += 4;
  }

  if ((payload.notes?.length ?? 0) > 40) {
    score += 8;
  }

  return Math.min(100, score);
};

async function forwardToWebhook(record: LeadRecord) {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) return;

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
  } catch (error) {
    console.error("Failed to forward lead to webhook", error);
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LeadPayload | null;

  if (!body) {
    return NextResponse.json(
      { success: false, message: "Invalid payload." },
      { status: 400 },
    );
  }

  const missing = requiredFields.filter((field) => {
    const value = body[field];
    return !value || (typeof value === "string" && value.trim().length === 0);
  });

  if (missing.length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: `Missing: ${missing.map((field) => friendlyNames[field]).join(", ")}`,
      },
      { status: 422 },
    );
  }

  const score = leadScore(body);

  const record: LeadRecord = {
    id: randomUUID(),
    name: body.name!.trim(),
    email: body.email!.toLowerCase(),
    style: toArray(body.style),
    fit: body.fit,
    budget: body.budget,
    notes: body.notes?.trim() ?? "",
    score,
    createdAt: new Date().toISOString(),
  };

  await Promise.allSettled([persistLead(record), forwardToWebhook(record)]);

  return NextResponse.json({ success: true, score });
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: true, leads: [] });
  }

  try {
    const fs = await import("fs/promises");
    const path = (await import("path")).default;
    const filePath = path.join(process.cwd(), "data", "leads.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const leads = JSON.parse(raw) as LeadRecord[];

    return NextResponse.json({ success: true, leads });
  } catch {
    return NextResponse.json({ success: true, leads: [] });
  }
}
