import Link from 'next/link';
import EmailCta from '@/components/EmailCta';

// ============================================================
// HOMEPAGE — free model
// All schools are free to read. School 1 is open; the rest are
// coming soon and open one at a time. Email capture is the ask.
// ============================================================

const SCHOOLS: {
  num: string;
  title: string;
  tagline: string;
  episodes: number;
  href?: string;
}[] = [
  {
    num: '01',
    title: 'The Abandoned Girl.',
    tagline: 'Your healing begins when you stop abandoning yourself.',
    episodes: 12,
    href: '/school-1/index.html',
  },
  { num: '02', title: 'The Body Temple.', tagline: 'Your body is not your enemy. It is your vessel.', episodes: 10 },
  { num: '03', title: 'The Inner Architect.', tagline: 'Your habits are your prayer.', episodes: 10 },
  { num: '04', title: 'The Sacred Woman.', tagline: 'She knows who she is before the room confirms it.', episodes: 10 },
  { num: '05', title: 'The Woman Who Builds.', tagline: 'God is not glorified by your broke.', episodes: 10 },
  { num: '06', title: 'The Genesis Blueprint.', tagline: 'The blueprint was always there.', episodes: 10 },
  { num: '07', title: 'The Jesus MBA.', tagline: 'Every parable is a masterclass.', episodes: 10 },
  { num: '08', title: 'The Sacred Body.', tagline: 'So sacred that only a covenant is worthy of it.', episodes: 10 },
  { num: '09', title: 'The Sacred Family.', tagline: 'The destruction stops here.', episodes: 10 },
  { num: '10', title: 'The Sacred Mind.', tagline: 'The mind is the only battlefield that matters.', episodes: 10 },
];

const PILLARS = [
  {
    num: 'I',
    title: 'Spirit',
    text: 'Identity and purpose. She knows who she is before God, not borrowed from a relationship, a title or a following.',
  },
  {
    num: 'II',
    title: 'Body',
    text: 'Healing and embodiment. She lives in her body, not at war with it. The vessel through which everything else flows.',
  },
  {
    num: 'III',
    title: 'Mind',
    text: 'Discipline and becoming. An inner architecture that holds her on the hard days. Her habits are her devotion.',
  },
  {
    num: 'IV',
    title: 'Wealth',
    text: 'Freedom and legacy. She builds systems, not just income, and the freedom to live her calling without permission.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ivory text-plum">
      {/* ─── NAV ─── */}
      <nav className="bg-plum px-6 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/avizaya-seal-ivory.svg" alt="Avizaya seal" className="w-8 h-8" />
          <span className="font-serif text-lg tracking-[0.22em] uppercase text-ivory font-light">
            Avizaya
          </span>
        </Link>
        <div className="flex items-center gap-5 md:gap-7">
          <a href="#schools" className="text-[11px] tracking-[0.2em] uppercase text-ivory text-opacity-70 hover:text-gold transition">
            The Schools
          </a>
          <a href="/manifesto.html" className="text-[11px] tracking-[0.2em] uppercase text-ivory text-opacity-70 hover:text-gold transition">
            The Manifesto
          </a>
          <a href="/school-1/index.html" className="text-[11px] tracking-[0.2em] uppercase text-gold hover:text-ivory transition">
            Start School 1
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="bg-plum px-8 pt-20 pb-24 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/avizaya-seal-ivory.svg" alt="" className="w-16 h-16 mx-auto mb-7" />
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-6 font-medium">
          The Whole Woman Framework
        </p>
        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-[0.14em] text-ivory mb-5">
          AVIZAYA
        </h1>
        <p className="font-serif italic text-lg md:text-xl text-ivory text-opacity-75 max-w-xl mx-auto leading-relaxed mb-8">
          A declaration for the woman who is done being half of herself. Not a
          makeover. Not a mindset shift. A complete rebuilding of spirit, body,
          mind and wealth.
        </p>
        <p className="text-[11px] tracking-[0.24em] uppercase text-gold text-opacity-80 mb-10">
          10 Schools &nbsp;&middot;&nbsp; 102 Episodes &nbsp;&middot;&nbsp; Free to read
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/school-1/index.html"
            className="inline-block px-9 py-4 rounded-lg bg-gold text-plum text-xs font-medium tracking-[0.2em] uppercase hover:bg-opacity-90 transition"
          >
            Begin School 1 &middot; Free
          </a>
          <a
            href="/manifesto.html"
            className="inline-block px-9 py-4 rounded-lg border border-gold border-opacity-60 text-ivory text-opacity-90 text-xs font-medium tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition"
          >
            Read the Manifesto
          </a>
        </div>
      </section>

      {/* ─── FOUR PILLARS ─── */}
      <section className="px-8 pt-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.26em] uppercase text-gold mb-4 font-medium">
            The Four Pillars
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light leading-snug">
            A woman broken in any one of these
            <br />
            is never <em className="text-gold italic">fully free.</em>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILLARS.map((p) => (
            <div key={p.num} className="bg-light rounded-xl p-7 border border-gold border-opacity-20">
              <p className="font-serif text-muted text-sm mb-4">{p.num}</p>
              <h3 className="font-serif text-xl mb-3">{p.title}</h3>
              <p className="font-serif italic text-sm text-muted leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SCHOOLS ─── */}
      <section id="schools" className="px-8 pt-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.26em] uppercase text-gold mb-4 font-medium">
            The Ten Schools
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light">
            The complete <em className="text-gold italic">rebuilding.</em>
          </h2>
          <p className="font-serif italic text-muted mt-4">
            School 1 is open now, free. The remaining schools open one at a time.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCHOOLS.map((s) =>
            s.href ? (
              <a
                key={s.num}
                href={s.href}
                className="bg-plum rounded-xl p-7 flex flex-col min-h-[240px] hover:-translate-y-1 hover:shadow-xl transition"
              >
                <p className="font-serif text-gold text-opacity-80 text-sm mb-4">{s.num}</p>
                <p className="text-[9px] tracking-[0.24em] uppercase text-gold mb-2 font-medium">
                  Avizaya &middot; School {parseInt(s.num, 10)} &middot; Open now
                </p>
                <h3 className="font-serif text-2xl text-ivory mb-2 leading-tight">{s.title}</h3>
                <p className="font-serif italic text-sm text-ivory text-opacity-70 leading-relaxed flex-1">
                  {s.tagline}
                </p>
                <div className="flex items-center justify-between mt-5">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-ivory text-opacity-50">
                    {s.episodes} episodes
                  </span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-medium">
                    Enter school &rarr;
                  </span>
                </div>
              </a>
            ) : (
              <div
                key={s.num}
                className="bg-light rounded-xl p-7 flex flex-col min-h-[240px] border border-gold border-opacity-20"
              >
                <p className="font-serif text-muted text-opacity-70 text-sm mb-4">{s.num}</p>
                <p className="text-[9px] tracking-[0.24em] uppercase text-muted mb-2 font-medium">
                  Avizaya &middot; School {parseInt(s.num, 10)}
                </p>
                <h3 className="font-serif text-2xl text-plum text-opacity-80 mb-2 leading-tight">
                  {s.title}
                </h3>
                <p className="font-serif italic text-sm text-muted leading-relaxed flex-1">
                  {s.tagline}
                </p>
                <div className="flex items-center justify-between mt-5">
                  <span className="text-[10px] tracking-[0.18em] uppercase text-muted text-opacity-70">
                    {s.episodes} episodes
                  </span>
                  <span className="text-[10px] tracking-[0.18em] uppercase text-muted">
                    Coming soon
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ─── EMAIL CTA ─── */}
      <section className="px-8 pt-16">
        <EmailCta source="homepage" />
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="mt-20 bg-plum px-8 py-12 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/avizaya-seal-ivory.svg" alt="" className="w-11 h-11 mx-auto mb-4 opacity-90" />
        <p className="font-serif text-base tracking-[0.24em] uppercase text-ivory mb-2">Avizaya</p>
        <p className="font-serif italic text-sm text-ivory text-opacity-60 mb-6">
          She was never lost. She was always becoming.
        </p>
        <div className="flex justify-center gap-6 mb-6 flex-wrap">
          <a href="#schools" className="text-[10px] tracking-[0.2em] uppercase text-ivory text-opacity-60 hover:text-gold transition">
            The Schools
          </a>
          <a href="/manifesto.html" className="text-[10px] tracking-[0.2em] uppercase text-ivory text-opacity-60 hover:text-gold transition">
            The Manifesto
          </a>
          <a href="/school-1/index.html" className="text-[10px] tracking-[0.2em] uppercase text-ivory text-opacity-60 hover:text-gold transition">
            School 1
          </a>
        </div>
        <p className="text-[10px] tracking-[0.12em] text-ivory text-opacity-40">
          &copy; 2026 Avizaya &nbsp;&middot;&nbsp; Founded in purpose &middot; Built for generations
        </p>
      </footer>
    </main>
  );
}
