import Link from "next/link";
import { SITE_URLS } from "@prism/config";

export const metadata = {
  title: "Privacy Policy — Prism",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[640px] flex-col justify-center px-6 py-24">
      <Link href="/" className="mb-10 font-serif text-2xl font-extralight tracking-[-0.01em] text-fg">
        Prism
      </Link>
      <span className="mb-3 font-mono text-xs tracking-[0.12em] text-muted uppercase">[ Privacy Policy ]</span>
      <h1 className="mb-6 font-serif text-3xl font-extralight tracking-[-0.01em] text-fg">Not yet published.</h1>
      <p className="mb-4 font-sans text-[15px] leading-[1.7] text-muted">
        Prism has no incorporated legal entity yet, so there is no privacy policy to publish. One will be written
        and posted here before this site collects any personal data beyond what a browser sends by default.
      </p>
      <p className="font-sans text-[15px] leading-[1.7] text-muted">
        For where things actually stand, see{" "}
        <a href={`${SITE_URLS.docs}/status`} className="text-fg underline underline-offset-2" target="_blank" rel="noreferrer">
          the status page
        </a>
        , or{" "}
        <Link href="/#footer" className="text-fg underline underline-offset-2">
          get in touch
        </Link>
        .
      </p>
    </div>
  );
}
