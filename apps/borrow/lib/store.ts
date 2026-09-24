import { randomBytes, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ApplicationStatus, LoanApplication, NewApplicationInput } from "./types";

/**
 * Minimal file-backed repository standing in for a real applications
 * database. The API routes only ever import from here, so swapping this for
 * Postgres/Prisma later touches this file alone, not the routes or UI.
 */
const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "applications.json");

function ensureStore(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, "[]", "utf8");
}

function readAll(): LoanApplication[] {
  ensureStore();
  try {
    return JSON.parse(readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeAll(apps: LoanApplication[]): void {
  ensureStore();
  writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2), "utf8");
}

export function createApplication(input: NewApplicationInput): LoanApplication {
  const now = new Date().toISOString();
  const app: LoanApplication = {
    ...input,
    id: randomUUID(),
    accessToken: randomBytes(16).toString("hex"),
    createdAt: now,
    updatedAt: now,
    status: "submitted",
    timeline: [{ at: now, status: "submitted" }],
  };
  const apps = readAll();
  apps.push(app);
  writeAll(apps);
  return app;
}

export function getApplication(id: string): LoanApplication | null {
  return readAll().find((a) => a.id === id) ?? null;
}

export function listApplications(): LoanApplication[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updateApplicationStatus(id: string, status: ApplicationStatus, note?: string): LoanApplication | null {
  const apps = readAll();
  const app = apps.find((a) => a.id === id);
  if (!app) return null;
  const now = new Date().toISOString();
  app.status = status;
  app.updatedAt = now;
  app.timeline.push({ at: now, status, note });
  writeAll(apps);
  return app;
}
