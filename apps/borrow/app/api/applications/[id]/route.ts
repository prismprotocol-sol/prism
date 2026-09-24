import { NextResponse } from "next/server";
import { getApplication, updateApplicationStatus } from "@/lib/store";
import { isAuthorizedReviewer } from "@/lib/reviewAuth";
import type { ApplicationStatus } from "@/lib/types";

/** The applicant's own token grants access, or the reviewer secret (used by the admin app's proxy). */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get("token");

  const app = getApplication(id);
  if (!app || (app.accessToken !== token && !isAuthorizedReviewer(request))) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const { accessToken: _accessToken, ...rest } = app;
  return NextResponse.json(rest);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorizedReviewer(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as { status?: ApplicationStatus; note?: string };
  if (!body.status) {
    return NextResponse.json({ error: "Missing status." }, { status: 400 });
  }

  const app = updateApplicationStatus(id, body.status, body.note);
  if (!app) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { accessToken: _accessToken, ...rest } = app;
  return NextResponse.json(rest);
}
