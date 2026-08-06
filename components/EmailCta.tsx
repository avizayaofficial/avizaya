'use client';

// ============================================================
// EMAIL CTA — free-model signup block
// Posts to /api/subscribe (Supabase email_subscribers table).
// ============================================================

import { useState } from 'react';

export default function EmailCta({ source = 'homepage' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const MC_URL =
    'https://avizaya.us1.list-manage.com/subscribe/post-json?u=76683a178bdba458a5475422b&id=18050bf063&f_id=00f2c2e1f0';
  const MC_HONEYPOT = 'b_76683a178bdba458a5475422b_18050bf063';

  function subscribeMailchimp(value: string): Promise<boolean> {
    return new Promise((resolve) => {
      const cbName = 'mcCallback' + Math.floor(Math.random() * 1e9);
      const w = window as unknown as Record<string, unknown>;
      w[cbName] = (resp: { result?: string; msg?: string }) => {
        delete w[cbName];
        resolve(
          resp?.result === 'success' ||
            (resp?.msg ?? '').includes('already subscribed')
        );
      };
      const s = document.createElement('script');
      s.src =
        MC_URL +
        '&EMAIL=' +
        encodeURIComponent(value) +
        '&' +
        MC_HONEYPOT +
        '=&c=' +
        cbName;
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  }

  async function submit() {
    if (!email.trim() || status === 'sending') return;
    setStatus('sending');
    try {
      // Keep a copy in our own database (non-blocking).
      fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      }).catch(() => {});
      const ok = await subscribeMailchimp(email.trim());
      setStatus(ok ? 'sent' : 'error');
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
        Leave your email and you will be the first to know when a new
        school is published.
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
          {status === 'error' && (
            <p className="text-[11px] text-ivory text-opacity-40 mt-4">
              Something went wrong. Try again.
            </p>
          )}
        </>
      )}
    </div>
  );
}
