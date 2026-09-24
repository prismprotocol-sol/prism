export const heroHeadlines = ["Credit that works for everyone", "Credit belongs to all"] as const;

export const services = [
  {
    index: "01",
    title: "Discover",
    body: "We embed with your team to understand your business. Interviews, workflow mapping, and rigorous documentation to help find where AI actually moves the needle.",
  },
  {
    index: "02",
    title: "Build",
    body: "We turn strategy into working software with custom agents built on top of your tools and embedded AI in your products. Built for your workflows, not generic use cases.",
  },
  {
    index: "03",
    title: "Adopt",
    body: "We don’t just hand over a working system, we make sure it gets adopted. We redesign workflows around it, train your people, and stay until it sticks.",
  },
] as const;

export const workFilters = ["Healthcare", "Hospitality", "Manufacturing", "Financial Services"] as const;

export const caseStudies = [
  {
    name: "Structured Credit",
    body: "The originator loses first, always. Investors sit above that in tranches, senior, mezzanine, and junior, each priced for how much protection is underneath it.",
    image: "/images/services-bg.webp",
    alt: "Halftone-processed archival photograph of an early biplane at dusk",
    size: "large",
  },
  {
    name: "On-Chain Liquidity",
    body: "Credit used to mean locking up capital and finding out what happened at maturity, when it's too late to act. Your tranche position trades on-chain the whole time. Price it, watch it, exit it, before maturity if you need to.",
    image: "/images/testimonial-bg.webp",
    alt: "Halftone-processed archival photograph of a mission control room",
    size: "small",
  },
] as const;

export const metrics = [
  { value: "15%+", label: "Capital cushion the originator posts to absorb losses before investors do" },
  { value: "4", label: "Tranche layers standing between a senior investor and first-dollar risk" },
  { value: "90 Days", label: "Maximum receivable maturity per pool. No twelve-month unsecured credit, ever" },
] as const;

export const whyChooseFeatures = [
  {
    eyebrow: "ORIGINATOR FIRST-LOSS",
    headline: "Skin in the game, enforced by code.",
    body: "Every pool requires the originator to post first-loss capital before it opens. A floor the contract checks, not a policy that can be waived.",
  },
  {
    eyebrow: "FOR ORIGINATORS",
    headline: "Funded in days, not warehouse-line months.",
    body: "Bring receivables banks can't move fast enough on. Post first-loss, get tranched and priced, and raise from investors who don't need a warehouse-line minimum to say yes.",
  },
  {
    eyebrow: "ON-CHAIN INFRASTRUCTURE",
    headline: "Built on Solana programs, not paperwork.",
    body: "First-loss floors, tripwires, and repayment controls run as contract logic on Solana. Checked automatically, not audited after the fact.",
  },
] as const;

export const articles = [
  {
    index: "001",
    title: "What If Credit Worked Like a Stock Market?",
    excerpt:
      "PRISM is turning credit risk into something liquid, tradable, and programmable on Solana. Credit is one of the largest markets in the world, but most credit products still behave like private spreadsheets.",
    href: "https://x.com/PrismProtoc0l/status/2054479693416730750",
    author: "Prism Protocol",
  },
  {
    index: "002",
    title: "Building Crypto's Missing Credit Market",
    excerpt:
      "Why has crypto rebuilt almost every major financial primitive... except credit? You lend money, your capital stays locked until repayment. The real market isn't lending — it's the risk behind lending.",
    href: "https://x.com/SkyyCodes/status/2070108824124764520",
    author: "SkyyCodes",
  },
] as const;

export const faqs = [
  {
    question: "Does Prism ever lend directly?",
    answer:
      "No. Prism structures and tranches pools that originators bring — invoice discounters, merchant lenders, payout platforms — it never originates or holds loans on its own balance sheet.",
  },
  {
    question: "How long does onboarding take?",
    answer:
      "Institutional investors complete accreditation and KYC first — that's how pool one opens. Once verified, you get access to the open tranches, no waiting on a fund close.",
  },
  {
    question: "Can I exit a position before maturity?",
    answer:
      "Yes. Every position we structure trades on our on-chain liquidity layer, so you can price and exit whenever you need to, not just at maturity.",
  },
  {
    question: "How is credit risk priced?",
    answer:
      "Every pool's originator posts first-loss capital before it opens, and tranche pricing is set from that subordination plus the pool's expected loss profile — not a black-box model.",
  },
  {
    question: "What chain does Prism run on?",
    answer:
      "Solana. It gives us the settlement speed and low fees needed to make credit positions genuinely tradable, not just tokenized on paper.",
  },
  {
    question: "How are fees structured?",
    answer:
      "A flat management fee on deployed capital, plus a performance fee only on realized yield above the tranche's base rate. No entry or exit fees.",
  },
] as const;

export const securityPlates = [
  {
    index: "01",
    title: "Originator First-Loss.",
    body: "Before a pool opens, the originator posts first-loss capital on-chain, an enforced floor, not a promise on a pitch deck.",
    image: "/images/security-data-protection.webp",
  },
  {
    index: "02",
    title: "Controlled Repayments.",
    body: "Borrower repayments settle into accounts the originator can't move money out of, closing the gap where past on-chain lenders lost track of cash.",
    image: "/images/security-compliance.webp",
  },
  {
    index: "03",
    title: "Automatic Tripwire.",
    body: "If collections fall below a pool's threshold, new funding stops automatically and incoming cash goes to repaying investors first.",
    image: "/images/security-access.webp",
  },
] as const;

export const techStack = ["Solana", "Superteam India", "Rust", "Claude", "Anchor"] as const;

export const navLinks = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#security" },
  { label: "SERVICES", href: "#services" },
] as const;
