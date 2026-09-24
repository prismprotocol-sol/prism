"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useProgram, useConfig, configPda, pct } from "@prism/solana";
import { Card, Stat, Button, AmountInput, Note, Empty, PageHeader, Field } from "@prism/ui";
import { TxPanel } from "@/components/TxPanel";
import { useTx } from "@/lib/useTx";
import { useAccess } from "@/lib/useAccess";

export default function ConfigPage() {
  const program = useProgram();
  const { publicKey } = useWallet();
  const { config, refresh } = useConfig();
  const { isProtocolAdmin } = useAccess();
  const { state, run } = useTx();

  const [riskFree, setRiskFree] = useState("");
  const [floor, setFloor] = useState("");

  const initConfig = () =>
    run("Config created", async () => {
      if (!publicKey) throw new Error("Connect a wallet first.");
      const sig = await program.methods
        .initConfig()
        .accounts({ admin: publicKey, config: configPda(), systemProgram: SystemProgram.programId })
        .rpc();
      await refresh();
      return sig;
    });

  const updateConfig = () =>
    run("Config updated", async () => {
      if (!publicKey) throw new Error("Connect a wallet first.");
      const sig = await program.methods
        .updateConfig({
          riskFreeBps: riskFree ? parseInt(riskFree) : null,
          lambdaBps: null,
          alphaFloorBps: floor ? parseInt(floor) : null,
          alphaCapBps: null,
          coreCapBps: null,
          primeCapBps: null,
          maxCouponBps: null,
          maxFeeBps: null,
        })
        .accounts({ admin: publicKey, config: configPda() })
        .rpc();
      await refresh();
      return sig;
    });

  return (
    <div className="space-y-8 px-6 py-10">
      <PageHeader
        eyebrow="protocol settings"
        title="Protocol config"
        description="Gated to the wallet recorded as Config.admin. Changing these values never reprices an existing vault — rates freeze at clearing."
      />

      {!config ? (
        <Card>
          <Empty>Not initialized on this cluster yet. Creating it writes the documented defaults.</Empty>
          <div className="mt-4">
            <Button onClick={initConfig} disabled={state.status === "pending" || !publicKey}>
              Initialize config
            </Button>
          </div>
          <div className="mt-4">
            <TxPanel state={state} />
          </div>
        </Card>
      ) : (
        <Card>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="Risk free" value={pct(config.riskFreeBps)} />
            <Stat label="Lambda" value={(config.lambdaBps / 10_000).toFixed(2)} />
            <Stat label="Alpha floor" value={pct(config.alphaFloorBps)} />
            <Stat label="Alpha cap" value={pct(config.alphaCapBps)} />
            <Stat label="Core cap" value={pct(config.coreCapBps)} />
            <Stat label="Prime cap" value={pct(config.primeCapBps)} />
            <Stat label="Max coupon" value={pct(config.maxCouponBps)} />
            <Stat label="Max fee" value={pct(config.maxFeeBps)} />
          </div>

          {!isProtocolAdmin ? (
            <Empty>Only {config.admin.toBase58().slice(0, 8)}… can update these values.</Empty>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <Field label="Risk free (bps)">
                  <AmountInput value={riskFree} onChange={setRiskFree} placeholder={String(config.riskFreeBps)} />
                </Field>
                <Field label="Alpha floor (bps)">
                  <AmountInput value={floor} onChange={setFloor} placeholder={String(config.alphaFloorBps)} />
                </Field>
                <div className="flex items-end">
                  <Button variant="ghost" onClick={updateConfig} disabled={state.status === "pending"}>
                    Apply
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <TxPanel state={state} />
              </div>
            </>
          )}

          <Note>
            Expected-loss inputs used at vault clearing are supplied per-vault (see each vault&rsquo;s admin page),
            not here — the protocol has no on-chain way to derive them from a loss distribution it hasn&rsquo;t
            measured yet.
          </Note>
        </Card>
      )}
    </div>
  );
}
