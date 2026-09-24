"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { PRISM_PROGRAM_ID, explorerUrl } from "@prism/config";
import { Empty, PageHeader } from "@prism/ui";

type Row = { signature: string; slot: number; err: boolean };

export default function ActivityPage() {
  const { connection } = useConnection();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    connection
      .getSignaturesForAddress(new PublicKey(PRISM_PROGRAM_ID), { limit: 25 })
      .then((sigs) => setRows(sigs.map((s) => ({ signature: s.signature, slot: s.slot, err: !!s.err }))))
      .catch(() => setRows([]));
  }, [connection]);

  return (
    <div className="space-y-8 px-6 py-10">
      <PageHeader
        eyebrow="activity"
        title="Protocol activity"
        description="Raw transaction history for the Prism program. The program emits only one structured event (RedemptionValue), so this is signature-level, not decoded per instruction — open a signature on Explorer for the full log."
      />

      {rows === null ? (
        <Empty>Loading…</Empty>
      ) : rows.length === 0 ? (
        <Empty>No activity recorded yet on this cluster.</Empty>
      ) : (
        <div className="space-y-1">
          {rows.map((r) => (
            <a
              key={r.signature}
              href={explorerUrl(r.signature)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between border border-line-soft px-4 py-2.5 font-mono text-xs text-muted hover:border-line-strong hover:text-fg"
            >
              <span>{r.signature.slice(0, 28)}…</span>
              <span>slot {r.slot}</span>
              <span className={r.err ? "text-muted-2" : "text-fg"}>{r.err ? "failed" : "confirmed"}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
