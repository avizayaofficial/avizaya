'use client';

// ============================================================
// EMAIL CTA — free-model signup block
// Posts to /api/subscribe (Supabase email_subscribers table).
// ============================================================

import { useState } from 'react';

export default function EmailCta({ source = 'homepage' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit() {
    if (!email.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="bg-plum rounded-2xl max-w-3xl mx-auto px-8 py-12 text-center">
      <h3 className="font-serif text-2xl md:text-3xl font-light text-ivory leading-snug mb-4">
        Be first at the door when the{' '}
        <em className="text-gold italic">next school opens.</em>
      </h3>
      <p className="text-sm text-ivory text-opacity-70 max-w-md mx-auto mb-7 leading-relaxed">
        Every school is free to read. Leave your email and you will be the
        first to know when a new school is published.
      </p>
      {status === 'sent' ? (
        <p className="font-serif italic text-lg text-gold">
          You are on the list. When the next door opens, you will be the first
          to know.
        </p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              placeholder="Your email address"
              className="flex-1 px-5 py-4 rounded-lg bg-ivory bg-opacity-10 border border-gold border-opacity-40 text-ivory placeholder:text-ivory placeholder:text-opacity-40 focus:border-gold focus:outline-none text-sm"
              disabled={status === 'sending'}
            />
            <button
              type="button"
              onClick={submit}
              disabled={status === 'sending' || !email.trim()}
              className="px-7 py-4 rounded-lg bg-gold text-plum text-xs font-medium tracking-[0.18em] uppercase hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending…' : 'Keep me posted'}
            </button>
          </div>
          <p className="text-[11px] text-ivory text-opacity-40 mt-4">
            {status === 'error'
              ? 'Something went wrong. Try again.'
              : 'No noise. Only new schools and what matters.'}
          </p>
        </>
      )}
    </div>
  );
}
