import { NextResponse } from "next/server";
import { borrowApiFetch } from "@/lib/reviewProxy";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await borrowApiFetch(`/api/applications/${id}`);
  if (!res.ok) return NextResponse.json({ error: "Not found." }, { status: res.status });
  return NextResponse.json(await res.json());
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.text();
  const res = await borrowApiFetch(`/api/applications/${id}`, { method: "PATCH", body });
  if (!res.ok) return NextResponse.json({ error: "Update failed." }, { status: res.status });
  return NextResponse.json(await res.json());
}
