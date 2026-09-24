export type ApplicationStatus = "submitted" | "in_review" | "info_requested" | "approved" | "rejected";

export type TimelineEntry = {
  at: string;
  status: ApplicationStatus;
  note?: string;
};

export type LoanApplication = {
  id: string;
  accessToken: string;
  createdAt: string;
  updatedAt: string;
  status: ApplicationStatus;
  business: {
    legalName: string;
    entityType: string;
    country: string;
    website: string;
    yearsOperating: string;
    industry: string;
  };
  contact: {
    fullName: string;
    email: string;
    phone: string;
  };
  financing: {
    requestedAmount: string;
    purpose: string;
    termMonths: string;
  };
  documentsNote: string;
  wallet: string;
  timeline: TimelineEntry[];
};

export type NewApplicationInput = Omit<
  LoanApplication,
  "id" | "accessToken" | "createdAt" | "updatedAt" | "status" | "timeline"
>;
