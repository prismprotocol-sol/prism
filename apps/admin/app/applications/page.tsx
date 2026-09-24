"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, StatusTag, Empty, PageHeader } from "@prism/ui";
import { applicationStatus } from "@/lib/statusTone";
import type { LoanApplication } from "@/lib/types";

export default function ApplicationsPage() {
  const [apps, setApps] = useState<LoanApplication[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setApps)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="space-y-8 px-6 py-10">
      <PageHeader
        eyebrow="applications"
        title="Borrower applications"
        description="Off-chain intake from borrow.prism.credit. Approving here doesn't touch the chain — creating and funding the vault is a separate step once terms are set."
      />

      {error ? (
        <Empty>Couldn&rsquo;t reach the borrower app&rsquo;s API. Is it running and is REVIEW_API_TOKEN configured on both apps?</Empty>
      ) : apps === null ? (
        <Empty>Loading…</Empty>
      ) : apps.length === 0 ? (
        <Empty>No applications submitted yet.</Empty>
      ) : (
        <div className="space-y-1">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className="flex items-center justify-between border border-line-soft px-4 py-3 transition-colors duration-[var(--dur-micro)] ease-out hover:border-line-strong"
            >
              <div>
                <div className="font-sans text-sm text-fg">{app.business.legalName || "Untitled application"}</div>
                <div className="font-mono text-xs text-muted">{app.contact.email}</div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-mono text-xs text-muted">${app.financing.requestedAmount}</span>
                <span className="font-mono text-xs text-muted-2">{new Date(app.createdAt).toLocaleDateString()}</span>
                <StatusTag {...applicationStatus(app.status)} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
