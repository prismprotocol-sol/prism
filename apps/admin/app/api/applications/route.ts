import { NextResponse } from "next/server";
import { borrowApiFetch } from "@/lib/reviewProxy";

export async function GET() {
  const res = await borrowApiFetch("/api/applications");
  if (!res.ok) return NextResponse.json({ error: "Upstream error." }, { status: res.status });
  return NextResponse.json(await res.json());
}
