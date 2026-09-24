export default function Footer() {
  return (
    <footer id="footer">
      <div className="grid grid-cols-2 gap-8 p-[clamp(32px,5vw,56px)_clamp(20px,4vw,64px)] border-b border-line-soft max-mobile:grid-cols-1">
        <div>
          <p className="mb-4 font-mono text-xs tracking-[0.12em] text-muted uppercase">[ Links ]</p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 font-sans text-[13px] text-fg [&_a]:transition-colors [&_a]:duration-[var(--dur-micro)] [&_a]:ease-out [&_a:hover]:text-muted">
              <a href="#home">HOME</a>
              <span className="text-muted-2">\</span>
              <a href="#security">ABOUT</a>
              <span className="text-muted-2">\</span>
              <a href="#services">SERVICES</a>
              <span className="text-muted-2">\</span>
              <a href="https://www.linkedin.com/company/prism/" target="_blank" rel="noreferrer">
                LINKEDIN
              </a>
            </div>
            <div className="flex flex-wrap gap-2 font-sans text-[13px] text-fg [&_a]:transition-colors [&_a]:duration-[var(--dur-micro)] [&_a]:ease-out [&_a:hover]:text-muted">
              <a href="/privacy">PRIVACY POLICY</a>
              <span className="text-muted-2">\</span>
              <a href="/terms">TERMS OF SERVICE</a>
            </div>
          </div>
        </div>
        <div className="font-mono text-xs tracking-[0.06em] leading-[1.7] text-muted text-right max-mobile:text-left">
          <div>© 2026 Prism</div>
        </div>
      </div>
    </footer>
  );
}
