import { CreateLinkForm } from "@/components/create-link-form";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <nav>
        <a className="brand" href="#"><Image src="/brand/blink-mark-512.png" alt="" width={36} height={36} priority /><span>BLINK</span></a>
        <div className="nav-links"><a href="#use-cases">Use cases</a><a href="#how">How it works</a><a href="#developers">Developers</a></div>
        <div className="network"><i /> Network online</div>
      </nav>
      <section className="hero">
        <div className="eyebrow">LINKS WITH PROOF</div>
        <h1>Short links.<br /><em>Actually yours.</em></h1>
        <p className="lede">Create portable links owned by your Stellar wallet. Update the destination anytime—without trusting a platform.</p>
        <div className="grid">
          <CreateLinkForm />
          <aside>
            <div className="proof-card"><span>ON-CHAIN RECORD</span><div className="chain-line"><i /><i /><i /><i /></div><h3>One alias.<br />Verifiable ownership.</h3><p>Every link is backed by a Soroban contract and controlled by its creator’s wallet.</p></div>
            <div className="stats"><div><b>∞</b><span>UPDATES</span></div><div><b>1</b><span>OWNER</span></div><div><b>0</b><span>LOCK-IN</span></div></div>
          </aside>
        </div>
      </section>
      <section className="principles"><article><b>01</b><h3>Own the alias</h3><p>Your wallet—not an account database—proves control.</p></article><article><b>02</b><h3>Change the route</h3><p>Keep the short link while your destination evolves.</p></article><article><b>03</b><h3>Verify everything</h3><p>Anyone can inspect ownership and status on Stellar.</p></article></section>

      <section className="ticker" aria-label="Product benefits">
        <div>WALLET OWNED <span>✦</span> OPEN BY DEFAULT <span>✦</span> PROGRAMMABLE ROUTES <span>✦</span> BUILT ON STELLAR <span>✦</span> NO PLATFORM LOCK-IN</div>
      </section>

      <section className="use-cases section-shell" id="use-cases">
        <header className="section-heading">
          <div><span className="section-index">/ 01</span><span className="eyebrow">BUILT FOR LINKS THAT MATTER</span></div>
          <h2>One permanent alias.<br /><em>Many possible destinations.</em></h2>
        </header>
        <div className="case-grid">
          <article className="case-card featured"><span>CREATORS</span><h3>One link for your evolving internet identity.</h3><p>Point it to your latest drop, profile, event, or community without changing the link your audience already knows.</p><div className="route-demo"><b>blink.to/caner</b><i>→</i><span>latest-project.xyz</span></div></article>
          <article className="case-card"><span>COMMUNITIES</span><h3>Wallet-governed community links.</h3><p>Make ownership transparent and transfer control when stewards change.</p><div className="card-mark">◎</div></article>
          <article className="case-card"><span>CAMPAIGNS</span><h3>A public route with a verifiable history.</h3><p>Reuse a memorable campaign alias while destinations change over time.</p><div className="card-mark">↗</div></article>
          <article className="case-card dark"><span>DEVELOPERS</span><h3>Composable aliases for apps and agents.</h3><p>Resolve links through the contract, listen to events, and build new experiences on top.</p><code>resolve(&quot;stellar&quot;) → Link</code></article>
        </div>
      </section>

      <section className="how section-shell" id="how">
        <header className="section-heading compact"><div><span className="section-index">/ 02</span><span className="eyebrow">THREE STEPS. NO ACCOUNT.</span></div><h2>From URL to owned route.</h2></header>
        <div className="steps">
          <article><div className="step-visual wallet-visual"><span>GBC7…K3W</span><i>✓</i></div><b>01 / CONNECT</b><h3>Use your Stellar wallet</h3><p>Your public key becomes the owner. No email, password, or private profile required.</p></article>
          <article><div className="step-visual alias-visual"><span>blink.to/</span><strong>orbit</strong></div><b>02 / CLAIM</b><h3>Choose a unique alias</h3><p>Sign once to create the on-chain record and prove who controls the route.</p></article>
          <article><div className="step-visual update-visual"><span>old.xyz</span><i>→</i><strong>new.xyz</strong></div><b>03 / ROUTE</b><h3>Update without breaking</h3><p>Change the destination while the public short link stays exactly the same.</p></article>
        </div>
      </section>

      <section className="proof-section section-shell">
        <div className="proof-copy"><span className="section-index">/ 03</span><span className="eyebrow">VERIFY, DON&apos;T TRUST</span><h2>The receipt is<br />the product.</h2><p>Every alias has an inspectable owner, destination, status, and update timestamp. Blink&apos;s interface can disappear; the ownership record remains readable on Stellar.</p><a href="#top" className="text-link">Explore the contract <span>↗</span></a></div>
        <div className="ledger-card">
          <div className="ledger-top"><span>LINK RECORD</span><span className="verified">● VERIFIED</span></div>
          <dl><div><dt>ALIAS</dt><dd>stellar</dd></div><div><dt>OWNER</dt><dd>GBC7…K3W</dd></div><div><dt>STATUS</dt><dd className="active">ACTIVE</dd></div><div><dt>PROTOCOL</dt><dd>SOROBAN</dd></div></dl>
          <div className="ledger-hash"><span>TX HASH</span><code>09ef62571202...dabdef9b</code></div>
          <div className="ledger-blocks">{Array.from({ length: 12 }).map((_, index) => <i key={index} />)}</div>
        </div>
      </section>

      <section className="developer-section" id="developers">
        <div className="section-shell developer-inner">
          <div><span className="section-index">/ 04</span><span className="eyebrow">OPEN BUILDING BLOCK</span><h2>Not just a shortener.<br /><em>A link primitive.</em></h2></div>
          <div className="developer-copy"><p>Use Blink aliases anywhere a durable, human-readable pointer is useful.</p><ul><li><span>01</span>Soroban contract events</li><li><span>02</span>Permissionless resolution</li><li><span>03</span>Wallet-native authorization</li><li><span>04</span>Portable frontend and custom domains</li></ul></div>
          <pre><span>import</span> {'{'} resolveLink {'}'} <span>from</span> <em>&quot;@blink/stellar&quot;</em>{"\n\n"}<b>const</b> link = <span>await</span> resolveLink(<em>&quot;orbit&quot;</em>);{"\n"}<b>return</b> redirect(link.destination);</pre>
        </div>
      </section>

      <section className="final-cta section-shell">
        <div className="cta-star">✦</div><span className="eyebrow">YOUR LINK SHOULD OUTLIVE THE PLATFORM</span><h2>Claim something<br />worth remembering.</h2><a href="#" className="cta-button">Create your on-chain link <span>↗</span></a>
      </section>

      <footer><a className="brand" href="#"><Image src="/brand/blink-mark-512.png" alt="" width={34} height={34} /><span>BLINK</span></a><p>Open-source link infrastructure on Stellar.</p><div><a href="#developers">Contract</a><a href="https://developers.stellar.org" target="_blank" rel="noreferrer">Stellar docs ↗</a></div><span>© 2026 BLINK</span></footer>
    </main>
  );
}
