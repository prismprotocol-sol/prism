"use client";

import { Suspense, use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Stat, StatusTag, Empty } from "@prism/ui";
import { applicationStatus } from "@/lib/statusTone";
import type { LoanApplication } from "@/lib/types";

export default function StatusPage({ params }: PageProps<"/status/[id]">) {
  return (
    <Suspense fallback={<div className="px-6 py-16"><Empty>Loading…</Empty></div>}>
      <Status params={params} />
    </Suspense>
  );
}

function Status({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [app, setApp] = useState<Omit<LoanApplication, "accessToken"> | null | "loading" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setApp("error");
      return;
    }
    fetch(`/api/applications/${id}?token=${token}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setApp)
      .catch(() => setApp("error"));
  }, [id, token]);

  if (app === "loading") {
    return (
      <div className="px-6 py-16">
        <Empty>Loading…</Empty>
      </div>
    );
  }

  if (app === "error" || app === null) {
    return (
      <div className="px-6 py-16">
        <Empty>
          We couldn&rsquo;t find that application. Check the tracking link we sent you, or{" "}
          <a href="/apply" className="text-fg underline underline-offset-2">
            submit a new application
          </a>
          .
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-16">
      <header className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-xs tracking-[0.08em] text-muted uppercase">
            Application {app.id.slice(0, 8)}…
          </span>
          <h1 className="mt-2 font-serif text-4xl text-fg">{app.business.legalName}</h1>
        </div>
        <StatusTag {...applicationStatus(app.status)} />
      </header>

      <Card title="Request">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Stat label="Requested" value={`$${app.financing.requestedAmount}`} />
          <Stat label="Term" value={app.financing.termMonths ? `${app.financing.termMonths} mo` : "—"} />
          <Stat label="Submitted" value={new Date(app.createdAt).toLocaleDateString()} />
        </div>
      </Card>

      {app.status === "info_requested" && (
        <Card title="Action needed" subtitle="From Prism">
          <p className="font-sans text-sm text-fg">
            {app.timeline.filter((t) => t.status === "info_requested").slice(-1)[0]?.note ??
              "We need more information to continue reviewing your application. We'll be in touch by email."}
          </p>
        </Card>
      )}

      <Card title="Timeline">
        <div className="space-y-3">
          {app.timeline
            .slice()
            .reverse()
            .map((t, i) => (
              <div key={i} className="flex items-start justify-between gap-4 border-t border-line-soft pt-3 first:border-t-0 first:pt-0">
                <div>
                  <StatusTag {...applicationStatus(t.status)} />
                  {t.note && <p className="mt-1.5 font-sans text-xs text-muted">{t.note}</p>}
                </div>
                <span className="whitespace-nowrap font-mono text-xs text-muted-2">
                  {new Date(t.at).toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
