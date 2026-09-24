import { Card, ArrowButton } from "@prism/ui";

const STEPS = [
  { n: "01", title: "Apply", body: "Tell us about your business and how much financing you need." },
  { n: "02", title: "Review", body: "Our team reviews your application and may request more information." },
  { n: "03", title: "Decision", body: "You get a clear approval, rejection, or terms to consider." },
];

export default function BorrowLanding() {
  return (
    <div className="space-y-16 px-6 py-16">
      <header className="max-w-2xl space-y-5">
        <span className="font-mono text-xs tracking-[0.08em] text-muted uppercase">[ borrow.prism.credit ]</span>
        <h1 className="font-serif text-5xl leading-tight text-fg">Financing for your business, from Prism.</h1>
        <p className="font-sans text-base text-muted">
          Prism funds credit facilities on-chain, structured into tranches for investors. As a borrower, the
          process is ordinary: tell us about your business, we review it, and financing is disbursed once terms
          are set. You don&rsquo;t need a crypto wallet to apply.
        </p>
        <ArrowButton href="/apply">Apply for financing</ArrowButton>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <Card key={s.n}>
            <span className="font-mono text-xs text-muted-2">{s.n}</span>
            <h2 className="mt-2 font-sans text-sm text-fg">{s.title}</h2>
            <p className="mt-2 font-sans text-sm text-muted">{s.body}</p>
          </Card>
        ))}
      </section>

      <Card title="Already applied?" subtitle="Track status" textured>
        <p className="font-sans text-sm text-muted">
          Use the tracking link we gave you at submission to check your application&rsquo;s status.
        </p>
      </Card>
    </div>
  );
}
