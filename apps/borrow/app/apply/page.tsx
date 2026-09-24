"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Field, TextInput, TextArea, ArrowButton, Note, PageHeader } from "@prism/ui";
import type { NewApplicationInput } from "@/lib/types";

const initial: NewApplicationInput = {
  business: { legalName: "", entityType: "", country: "", website: "", yearsOperating: "", industry: "" },
  contact: { fullName: "", email: "", phone: "" },
  financing: { requestedAmount: "", purpose: "", termMonths: "" },
  documentsNote: "",
  wallet: "",
};

export default function ApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = form.business.legalName && form.contact.email && form.financing.requestedAmount;

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Submission failed.");
      const { id, accessToken } = await res.json();
      router.push(`/status/${id}?token=${accessToken}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-6 py-16">
      <PageHeader
        eyebrow="apply"
        title="Apply for financing"
        description="Takes about five minutes. We'll follow up by email if we need anything else."
      />

      <Card title="Business">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Legal business name" required>
            <TextInput
              value={form.business.legalName}
              onChange={(e) => setForm({ ...form, business: { ...form.business, legalName: e.target.value } })}
            />
          </Field>
          <Field label="Entity type" hint="LLC, C-Corp, sole proprietor…">
            <TextInput
              value={form.business.entityType}
              onChange={(e) => setForm({ ...form, business: { ...form.business, entityType: e.target.value } })}
            />
          </Field>
          <Field label="Country of registration">
            <TextInput
              value={form.business.country}
              onChange={(e) => setForm({ ...form, business: { ...form.business, country: e.target.value } })}
            />
          </Field>
          <Field label="Industry">
            <TextInput
              value={form.business.industry}
              onChange={(e) => setForm({ ...form, business: { ...form.business, industry: e.target.value } })}
            />
          </Field>
          <Field label="Years operating">
            <TextInput
              value={form.business.yearsOperating}
              onChange={(e) => setForm({ ...form, business: { ...form.business, yearsOperating: e.target.value } })}
            />
          </Field>
          <Field label="Website" hint="Optional">
            <TextInput
              value={form.business.website}
              onChange={(e) => setForm({ ...form, business: { ...form.business, website: e.target.value } })}
            />
          </Field>
        </div>
      </Card>

      <Card title="Contact">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name">
            <TextInput
              value={form.contact.fullName}
              onChange={(e) => setForm({ ...form, contact: { ...form.contact, fullName: e.target.value } })}
            />
          </Field>
          <Field label="Email" required>
            <TextInput
              type="email"
              value={form.contact.email}
              onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
            />
          </Field>
          <Field label="Phone" hint="Optional">
            <TextInput
              value={form.contact.phone}
              onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
            />
          </Field>
        </div>
      </Card>

      <Card title="Financing request">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Requested amount (USDC)" required>
            <TextInput
              inputMode="decimal"
              value={form.financing.requestedAmount}
              onChange={(e) => setForm({ ...form, financing: { ...form.financing, requestedAmount: e.target.value } })}
            />
          </Field>
          <Field label="Preferred term (months)">
            <TextInput
              inputMode="numeric"
              value={form.financing.termMonths}
              onChange={(e) => setForm({ ...form, financing: { ...form.financing, termMonths: e.target.value } })}
            />
          </Field>
        </div>
        <Field label="What is this financing for?">
          <TextArea
            value={form.financing.purpose}
            onChange={(e) => setForm({ ...form, financing: { ...form.financing, purpose: e.target.value } })}
          />
        </Field>
        <Field label="Supporting documents" hint="List what you have available (financials, invoices, bank statements). We'll coordinate a secure upload after initial review.">
          <TextArea value={form.documentsNote} onChange={(e) => setForm({ ...form, documentsNote: e.target.value })} />
        </Field>
        <Field label="Solana wallet address" hint="Optional — only needed once financing is approved and a vault is set up for you.">
          <TextInput value={form.wallet} onChange={(e) => setForm({ ...form, wallet: e.target.value })} />
        </Field>
      </Card>

      {error && <p className="font-mono text-xs text-muted-2">{error}</p>}

      <ArrowButton onClick={submit} disabled={!canSubmit || submitting} className="w-full">
        {submitting ? "Submitting…" : "Submit application"}
      </ArrowButton>

      <Note>
        This financing runs through Prism&rsquo;s on-chain credit vaults, but applying does not require a wallet or
        any on-chain action. If approved, we&rsquo;ll set up your vault and only then involve your wallet, for
        disbursement.
      </Note>
    </div>
  );
}
