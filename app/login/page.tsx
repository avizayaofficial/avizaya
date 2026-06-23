'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';

function LoginInner() {
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent'); // 'subscribe' | 'school' | 'coaching' | null

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('sending');
    setErrorMessage('');

    const supabase = createBrowserSupabaseClient();
    const school = searchParams.get('school');
    const params = new URLSearchParams();
    if (intent) params.set('intent', intent);
    if (school) params.set('school', school);
    const query = params.toString();
    const redirectTo = `${window.location.origin}/auth/callback${query ? `?${query}` : ''}`;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
    } else {
      setStatus('sent');
    }
  }

  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-medium">
            Avizaya
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-light leading-tight text-plum">
            Come in,
            <br />
            <em className="text-gold italic">daughter.</em>
          </h1>
          <p className="text-sm text-muted mt-6 leading-relaxed">
            Enter your email. We send a link. You click it. You're in. No
            passwords ever.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="bg-white p-8 rounded-lg border border-gold border-opacity-30 text-center">
            <p className="font-serif text-2xl text-plum mb-3">Check your email.</p>
            <p className="text-sm text-muted leading-relaxed">
              We sent a sign-in link to{' '}
              <span className="text-plum font-medium">{email}</span>. Click it to
              come in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-4 border border-gold border-opacity-30 rounded-lg bg-white font-sans text-plum placeholder-muted focus:border-gold focus:outline-none"
              disabled={status === 'sending'}
            />
            <button
              type="submit"
              disabled={status === 'sending' || !email.trim()}
              className="w-full py-4 bg-plum text-ivory text-sm tracking-wider uppercase hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending...' : 'Send my link'}
            </button>
            {status === 'error' && (
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            )}
          </form>
        )}

        <p className="text-center text-xs text-muted mt-8">
          By continuing you agree to receive emails from Avizaya.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
