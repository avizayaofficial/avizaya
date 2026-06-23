'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function JoinInner() {
  const params = useSearchParams();
  // avizaya.com/join?src=tiktok  or  ?src=instagram  etc.
  const source = params.get('src') || params.get('from') || 'social';
  const tag = params.get('tag') || undefined;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit() {
    if (!email.trim()) return;
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source, tag }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Try again.');
        return;
      }
      setStatus('sent');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }
  }

  return (
    <main className="min-h-screen bg-ivory text-plum flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-8 font-medium">
          Avizaya
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl font-light leading-tight mb-6">
          She was never lost.
          <br />
          <em className="text-gold italic">She was always becoming.</em>
        </h1>

        <div className="flex items-center gap-4 max-w-[10rem] mx-auto mb-8">
          <div className="flex-1 h-px bg-gold opacity-40" />
          <div className="w-1.5 h-1.5 bg-gold rotate-45" />
          <div className="flex-1 h-px bg-gold opacity-40" />
        </div>

        {status === 'sent' ? (
          <div className="bg-white p-8 rounded-lg border border-gold/30">
            <p className="font-serif text-2xl text-plum mb-3">You are on the list.</p>
            <p className="text-sm text-muted leading-relaxed">
              Watch your inbox. When the next door opens, you will be the first to know.
            </p>
          </div>
        ) : (
          <>
            <p className="font-serif italic text-lg text-muted leading-relaxed mb-8">
              Leave your email. I will write to you when it is time.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit();
                }}
                placeholder="your@email.com"
                className="w-full px-4 py-4 border border-gold/30 rounded-lg bg-white text-plum placeholder-muted focus:border-gold focus:outline-none text-center"
                disabled={status === 'sending'}
              />
              <button
                type="button"
                onClick={submit}
                disabled={status === 'sending' || !email.trim()}
                className="w-full py-4 bg-plum text-ivory text-sm tracking-wider uppercase hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Keep me close'}
              </button>
              {status === 'error' && (
                <p className="text-sm text-red-600">{message}</p>
              )}
            </div>
          </>
        )}

        <p className="text-center text-xs text-muted mt-10 leading-relaxed">
          No noise. No selling your name. Only what matters, when it matters.
        </p>
      </div>
    </main>
  );
}

export default function JoinPage() {
  return (
    <Suspense>
      <JoinInner />
    </Suspense>
  );
}
