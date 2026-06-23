import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ivory text-plum">
      {/* ─── HERO ─── */}
      <section className="px-8 py-24 md:py-32 max-w-3xl mx-auto text-center">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-10 font-medium">
          Avizaya
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-light leading-tight mb-8">
          She was never lost.
          <br />
          <em className="text-gold italic">She was always becoming.</em>
        </h1>
        <div className="flex items-center gap-4 max-w-xs mx-auto mb-10">
          <div className="flex-1 h-px bg-gold opacity-40" />
          <div className="w-1.5 h-1.5 bg-gold rotate-45" />
          <div className="flex-1 h-px bg-gold opacity-40" />
        </div>
        <p className="font-serif italic text-xl md:text-2xl text-muted leading-relaxed max-w-2xl mx-auto">
          A women's transformation program rooted in Scripture, psychology, and
          the lived experience of becoming whole.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-block px-10 py-4 bg-plum text-ivory font-sans tracking-wider text-sm uppercase hover:bg-opacity-90 transition"
          >
            Begin
          </Link>
          <a
            href="#pricing"
            className="inline-block px-10 py-4 border border-plum text-plum font-sans tracking-wider text-sm uppercase hover:bg-plum hover:text-ivory transition"
          >
            See the schools
          </a>
        </div>
      </section>

      {/* ─── MANIFESTO ─── */}
      <section className="px-8 py-20 max-w-2xl mx-auto">
        <p className="text-[10px] tracking-[0.25em] uppercase text-gold mb-6 font-medium text-center">
          The manifesto
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-center mb-12 leading-snug">
          I built this for the woman who is tired of being{' '}
          <em className="text-gold italic">half of herself.</em>
        </h2>
        <div className="space-y-6 text-base leading-relaxed">
          <p className="font-serif italic text-xl md:text-2xl text-plum leading-relaxed">
            You have given everything. To everyone. And still gone to bed feeling
            like you don't know who you are.
          </p>
          <p>
            I built Avizaya because the advice I needed didn't exist. Not in the
            way I needed it. Everything told me to choose. Heal your body or
            build your business. Be soft or be successful. Faith or finance.
            Rest or results.
          </p>
          <p className="font-medium text-plum">But I am not built for halves. And neither are you.</p>
          <div className="border-l-2 border-gold pl-6 py-2 my-8">
            <p className="font-serif italic text-xl text-plum">
              "She was never broken. She was carrying what wasn't hers. The
              moment she put it down, she remembered who she was."
            </p>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="px-8 py-20 bg-light">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold mb-4 font-medium text-center">
            Two ways to begin
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-center mb-16">
            Choose the path that meets you{' '}
            <em className="text-gold italic">where you are.</em>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Per school */}
            <div className="bg-white p-8 rounded-lg border-2 border-gold">
              <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-medium">
                One school
              </p>
              <p className="font-serif text-5xl text-plum mb-1">$50</p>
              <p className="text-sm text-muted mb-6">Yours forever</p>
              <p className="text-sm leading-relaxed mb-6">
                Permanent ownership of one school. Read it as many times as you
                need. Most begin with The Abandoned Girl.
              </p>
              <Link
                href="/schools"
                className="block w-full text-center py-3 bg-plum text-ivory text-sm tracking-wider uppercase hover:bg-opacity-90 transition"
              >
                Choose a school
              </Link>
            </div>

            {/* Coaching */}
            <div className="bg-white p-8 rounded-lg border border-gold border-opacity-30">
              <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-medium">
                With me
              </p>
              <p className="font-serif text-5xl text-plum mb-1">
                $250<span className="text-lg text-muted">/hr</span>
              </p>
              <p className="text-sm text-muted mb-6">1:1 with Dina</p>
              <p className="text-sm leading-relaxed mb-6">
                A private session. Limited spots each month. For women ready to
                do the deeper work with personal guidance.
              </p>
              <Link
                href="/login?intent=coaching"
                className="block w-full text-center py-3 bg-plum text-ivory text-sm tracking-wider uppercase hover:bg-opacity-90 transition"
              >
                Book a session
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-muted mt-12 max-w-xl mx-auto">
            Cost is not meant to be a barrier. If you genuinely cannot pay,{' '}
            <Link href="/scholarship" className="text-gold underline">
              write to me about a scholarship
            </Link>
            . The Father gives to those who ask.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-8 py-12 border-t border-gold border-opacity-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-medium">
            Avizaya
          </p>
          <p className="font-serif italic text-muted text-sm">
            And you, whether you found me today or years from now, you are part
            of it.
          </p>
        </div>
      </footer>
    </main>
  );
}
