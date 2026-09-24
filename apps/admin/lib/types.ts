export type ApplicationStatus = "submitted" | "in_review" | "info_requested" | "approved" | "rejected";

export type TimelineEntry = { at: string; status: ApplicationStatus; note?: string };

/** Mirrors the borrower app's LoanApplication, minus its access token — this app never sees that. */
export type LoanApplication = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ApplicationStatus;
  business: { legalName: string; entityType: string; country: string; website: string; yearsOperating: string; industry: string };
  contact: { fullName: string; email: string; phone: string };
  financing: { requestedAmount: string; purpose: string; termMonths: string };
  documentsNote: string;
  wallet: string;
  timeline: TimelineEntry[];
};
