import { AnchorProvider, Program, BN, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import idl from "./idl.json";

export const PROGRAM_ID = new PublicKey(idl.address);
export const SYSTEM_PROGRAM = new PublicKey("11111111111111111111111111111111");
export const RENT_SYSVAR = new PublicKey(
  "SysvarRent111111111111111111111111111111111"
);

/** USDC and the tranche mints all use 6 decimals. */
export const DECIMALS = 6;
export const UNIT = 1_000_000;

export const SENIORITY = { ALPHA: 0, CORE: 1, PRIME: 2 } as const;
export type Seniority = 0 | 1 | 2;

/** Ordered junior-first, matching the loss waterfall. */
export const TRANCHES = [
  {
    id: SENIORITY.ALPHA,
    name: "pALPHA",
    label: "Alpha",
    risk: "Junior",
    blurb: "Absorbs losses first. Highest rate.",
  },
  {
    id: SENIORITY.CORE,
    name: "pCORE",
    label: "Core",
    risk: "Mezzanine",
    blurb: "Absorbs losses after Alpha is exhausted.",
  },
  {
    id: SENIORITY.PRIME,
    name: "pPRIME",
    label: "Prime",
    risk: "Senior",
    blurb: "Paid first, loses last. Lowest rate.",
  },
] as const;

export const VAULT_STATE = [
  "Funding",
  "Active",
  "Matured",
  "Cancelled",
] as const;

export function stateName(state: Record<string, unknown>): string {
  return Object.keys(state ?? {})[0] ?? "unknown";
}

// ------------------------------------------------------------------ program

export function getProgram(
  connection: Connection,
  wallet: AnchorProvider["wallet"]
) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  return new Program(idl as Idl, provider);
}

// --------------------------------------------------------------------- pdas

const enc = (s: string) => Buffer.from(s, "utf8");

export const configPda = () =>
  PublicKey.findProgramAddressSync([enc("config")], PROGRAM_ID)[0];

export const vaultPda = (vaultId: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [enc("vault"), vaultId.toBuffer()],
    PROGRAM_ID
  )[0];

export const vaultAuthorityPda = (vault: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [enc("vault_authority"), vault.toBuffer()],
    PROGRAM_ID
  )[0];

export const escrowPda = (vault: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [enc("escrow"), vault.toBuffer()],
    PROGRAM_ID
  )[0];

export const trancheMintPda = (vault: PublicKey, seniority: Seniority) =>
  PublicKey.findProgramAddressSync(
    [enc("tranche_mint"), vault.toBuffer(), Buffer.from([seniority])],
    PROGRAM_ID
  )[0];

export const commitmentPda = (
  vault: PublicKey,
  investor: PublicKey,
  seniority: Seniority
) =>
  PublicKey.findProgramAddressSync(
    [
      enc("commit"),
      vault.toBuffer(),
      investor.toBuffer(),
      Buffer.from([seniority]),
    ],
    PROGRAM_ID
  )[0];

export const ata = (mint: PublicKey, owner: PublicKey) =>
  getAssociatedTokenAddressSync(mint, owner, true);

export const TOKEN_PROGRAM = TOKEN_PROGRAM_ID;
export const ATA_PROGRAM = ASSOCIATED_TOKEN_PROGRAM_ID;

// -------------------------------------------------------------------- money

/** Base units -> a display string. */
export function fmt(raw: BN | bigint | number | undefined, dp = 2): string {
  if (raw === undefined || raw === null) return "0";
  const n = Number(raw.toString()) / UNIT;
  return n.toLocaleString(undefined, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

/** A display amount -> base units. */
export function toBase(amount: string | number): BN {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!isFinite(n) || n <= 0) return new BN(0);
  return new BN(Math.round(n * UNIT));
}

export const pct = (bps: number, dp = 2) => `${(bps / 100).toFixed(dp)}%`;

// ---------------------------------------------------------------- economics

/**
 * The distributable pie: `(coupon - fee) x principal`.
 *
 * Everything payable to investors comes from here. No tranche arrangement
 * raises it.
 */
export function pie(principal: BN, couponBps: number, feeBps: number): BN {
  return principal.muln(couponBps - feeBps).divn(10_000);
}

/** Total interest promised at the current clearing rates. */
export function promisedInterest(
  tranches: { committed: BN; clearingBps: number }[]
): BN {
  return tranches.reduce(
    (acc, t) => acc.add(t.committed.muln(t.clearingBps).divn(10_000)),
    new BN(0)
  );
}

/**
 * Redemption value per token, in bps of face.
 *
 * ```
 * value(t) = 1.00 + rate x (t / term)
 * ```
 *
 * Deterministic, and distinct from market price — which is opinion, set by the
 * AMM rather than the program. Interfaces should show both.
 */
export function redemptionValueBps(
  clearingBps: number,
  committed: BN,
  loss: BN,
  activatedAt: number,
  termSeconds: number,
  now: number
): number {
  if (termSeconds === 0) return 10_000;
  const elapsed = Math.min(Math.max(now - activatedAt, 0), termSeconds);
  const accrued = Math.floor((clearingBps * elapsed) / termSeconds);
  const lossBps = committed.isZero()
    ? 0
    : loss.muln(10_000).div(committed).toNumber();
  return Math.max(10_000 + accrued - lossBps, 0);
}

/** Attachment band for a tranche, in bps of principal. */
export function attachment(
  tranches: { committed: BN }[],
  principal: BN,
  seniority: Seniority
): [number, number] {
  if (principal.isZero()) return [0, 0];
  const w = (i: number) =>
    tranches[i].committed.muln(10_000).div(principal).toNumber();
  const a = w(0);
  const c = w(1);
  if (seniority === 0) return [0, a];
  if (seniority === 1) return [a, a + c];
  return [a + c, 10_000];
}

// --------------------------------------------------------------------- pool

/** Canonical ordering, matching the program: a pair maps to one PDA. */
export function orderMints(a: PublicKey, b: PublicKey): [PublicKey, PublicKey] {
  return Buffer.compare(a.toBuffer(), b.toBuffer()) <= 0 ? [a, b] : [b, a];
}

export const poolPda = (mintA: PublicKey, mintB: PublicKey) => {
  const [lo, hi] = orderMints(mintA, mintB);
  return PublicKey.findProgramAddressSync(
    [enc("pool"), lo.toBuffer(), hi.toBuffer()],
    PROGRAM_ID
  )[0];
};

export const poolAuthorityPda = (pool: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [enc("pool_authority"), pool.toBuffer()],
    PROGRAM_ID
  )[0];

export const reservePda = (pool: PublicKey, side: "a" | "b") =>
  PublicKey.findProgramAddressSync(
    [enc(`reserve_${side}`), pool.toBuffer()],
    PROGRAM_ID
  )[0];

export const lpMintPda = (pool: PublicKey) =>
  PublicKey.findProgramAddressSync(
    [enc("lp_mint"), pool.toBuffer()],
    PROGRAM_ID
  )[0];

export const SWAP_FEE_BPS = 30;

/**
 * Constant-product output, fee taken on the input side.
 *
 * ```
 * dy = (y * dx') / (x + dx')     where dx' = dx * (1 - fee)
 * ```
 */
export function swapOut(
  reserveIn: BN,
  reserveOut: BN,
  amountIn: BN,
  feeBps = SWAP_FEE_BPS
): BN {
  if (reserveIn.isZero() || reserveOut.isZero() || amountIn.isZero()) {
    return new BN(0);
  }
  const afterFee = amountIn.muln(10_000 - feeBps).divn(10_000);
  return reserveOut.mul(afterFee).div(reserveIn.add(afterFee));
}

/** Integer square root — the first deposit's share scale is sqrt(a * b). */
function isqrt(n: BN): BN {
  if (n.ltn(2)) return n;
  let x = n;
  let y = x.addn(1).divn(2);
  while (y.lt(x)) {
    x = y;
    y = x.add(n.div(x)).divn(2);
  }
  return x;
}

/**
 * Shares minted for a deposit.
 *
 * Later deposits are credited at the **lesser** of the two ratios: depositing
 * off-ratio would otherwise move the price for free, so the excess on the
 * richer side stays in the pool.
 */
export function sharesForDeposit(
  supply: BN,
  reserveA: BN,
  reserveB: BN,
  amountA: BN,
  amountB: BN
): BN {
  if (supply.isZero() || reserveA.isZero() || reserveB.isZero()) {
    return isqrt(amountA.mul(amountB));
  }
  const byA = amountA.mul(supply).div(reserveA);
  const byB = amountB.mul(supply).div(reserveB);
  return BN.min(byA, byB);
}

/** Reserves returned when burning `shares`, pro-rata on both sides. */
export function withdrawAmounts(
  supply: BN,
  reserveA: BN,
  reserveB: BN,
  shares: BN
): [BN, BN] {
  if (supply.isZero()) return [new BN(0), new BN(0)];
  return [
    reserveA.mul(shares).div(supply),
    reserveB.mul(shares).div(supply),
  ];
}

/** Price impact of an order, in bps. */
export function priceImpactBps(
  reserveIn: BN,
  reserveOut: BN,
  amountIn: BN
): number {
  if (reserveIn.isZero() || amountIn.isZero()) return 0;
  const out = swapOut(reserveIn, reserveOut, amountIn);
  if (out.isZero()) return 10_000;
  // Spot rate vs realised rate, in bps.
  const spot = reserveOut.muln(10_000).div(reserveIn);
  const got = out.muln(10_000).div(amountIn);
  if (spot.isZero()) return 0;
  return Math.max(spot.sub(got).muln(10_000).div(spot).toNumber(), 0);
}
