"use client";

import { use, useEffect, useState } from "react";
import { Card, Stat, StatusTag, Button, TextArea, Field, Note, Empty } from "@prism/ui";
import { applicationStatus } from "@/lib/statusTone";
import type { ApplicationStatus, LoanApplication } from "@/lib/types";

export default function ApplicationDetailPage({ params }: PageProps<"/applications/[id]">) {
  const { id } = use(params);
  return <ApplicationDetail id={id} />;
}

function ApplicationDetail({ id }: { id: string }) {
  const [app, setApp] = useState<LoanApplication | null | "loading" | "error">("loading");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => {
    fetch(`/api/applications/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setApp)
      .catch(() => setApp("error"));
  };

  useEffect(load, [id]);

  const transition = async (status: ApplicationStatus) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: note || undefined }),
      });
      if (res.ok) {
        setApp(await res.json());
        setNote("");
      }
    } finally {
      setBusy(false);
    }
  };

  if (app === "loading") {
    return (
      <div className="px-6 py-10">
        <Empty>Loading…</Empty>
      </div>
    );
  }
  if (app === "error" || app === null) {
    return (
      <div className="px-6 py-10">
        <Empty>Application not found.</Empty>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-6 py-10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-xs tracking-[0.08em] text-muted uppercase">Application {app.id.slice(0, 8)}…</span>
          <h1 className="mt-2 font-serif text-3xl text-fg">{app.business.legalName || "Untitled application"}</h1>
        </div>
        <StatusTag {...applicationStatus(app.status)} />
      </header>

      <Card title="Request">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Stat label="Requested" value={`$${app.financing.requestedAmount}`} />
          <Stat label="Term" value={app.financing.termMonths ? `${app.financing.termMonths} mo` : "—"} />
          <Stat label="Submitted" value={new Date(app.createdAt).toLocaleDateString()} />
          <Stat label="Last update" value={new Date(app.updatedAt).toLocaleDateString()} />
        </div>
        {app.financing.purpose && <p className="mt-4 border-t border-line-soft pt-4 font-sans text-sm text-muted">{app.financing.purpose}</p>}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Business">
          <div className="space-y-2 font-mono text-xs">
            <Row k="Entity type" v={app.business.entityType} />
            <Row k="Country" v={app.business.country} />
            <Row k="Industry" v={app.business.industry} />
            <Row k="Years operating" v={app.business.yearsOperating} />
            <Row k="Website" v={app.business.website} />
          </div>
        </Card>
        <Card title="Contact">
          <div className="space-y-2 font-mono text-xs">
            <Row k="Name" v={app.contact.fullName} />
            <Row k="Email" v={app.contact.email} />
            <Row k="Phone" v={app.contact.phone} />
            <Row k="Wallet" v={app.wallet || "not provided"} />
          </div>
        </Card>
      </div>

      {app.documentsNote && (
        <Card title="Documents" subtitle="Applicant-provided note">
          <p className="font-sans text-sm text-muted">{app.documentsNote}</p>
        </Card>
      )}

      <Card title="Review" subtitle="Every transition is timestamped and visible to the applicant">
        <Field label="Note to applicant" hint="Shown on their status page — required when requesting more information.">
          <TextArea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note…" />
        </Field>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => transition("in_review")} disabled={busy}>
            Mark in review
          </Button>
          <Button variant="ghost" onClick={() => transition("info_requested")} disabled={busy || !note}>
            Request info
          </Button>
          <Button variant="primary" onClick={() => transition("approved")} disabled={busy}>
            Approve
          </Button>
          <Button variant="outline" onClick={() => transition("rejected")} disabled={busy}>
            Reject
          </Button>
        </div>
        <Note>
          Approving doesn&rsquo;t touch the chain. Once terms are agreed, open{" "}
          <a href="/vaults/create" className="text-fg underline underline-offset-2">
            Create Vault
          </a>{" "}
          with this applicant&rsquo;s wallet as borrower.
        </Note>
      </Card>

      <section className="space-y-3">
        <h2 className="font-sans text-sm text-fg">Timeline</h2>
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
                <span className="whitespace-nowrap font-mono text-xs text-muted-2">{new Date(t.at).toLocaleString()}</span>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{k}</span>
      <span className="text-fg">{v || "—"}</span>
    </div>
  );
}
