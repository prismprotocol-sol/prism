import { NextResponse } from "next/server";
import { createApplication, listApplications } from "@/lib/store";
import { isAuthorizedReviewer } from "@/lib/reviewAuth";
import type { NewApplicationInput } from "@/lib/types";

/** Reviewer-only listing — the admin app's server proxies this, never the browser directly. */
export async function GET(request: Request) {
  if (!isAuthorizedReviewer(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const apps = listApplications().map(({ accessToken: _accessToken, ...rest }) => rest);
  return NextResponse.json(apps);
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<NewApplicationInput>;

  if (!body.business?.legalName || !body.contact?.email || !body.financing?.requestedAmount) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const app = createApplication({
    business: {
      legalName: body.business.legalName,
      entityType: body.business.entityType ?? "",
      country: body.business.country ?? "",
      website: body.business.website ?? "",
      yearsOperating: body.business.yearsOperating ?? "",
      industry: body.business.industry ?? "",
    },
    contact: {
      fullName: body.contact.fullName ?? "",
      email: body.contact.email,
      phone: body.contact.phone ?? "",
    },
    financing: {
      requestedAmount: body.financing.requestedAmount,
      purpose: body.financing.purpose ?? "",
      termMonths: body.financing.termMonths ?? "",
    },
    documentsNote: body.documentsNote ?? "",
    wallet: body.wallet ?? "",
  });

  return NextResponse.json({ id: app.id, accessToken: app.accessToken }, { status: 201 });
}
