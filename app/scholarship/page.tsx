'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ScholarshipPage() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [situation, setSituation] = useState('');
  const [tier, setTier] = useState('school');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit() {
    if (!email.trim() || situation.trim().length < 10) {
      setMessage('Please add your email and a little about your situation.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/scholarship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          full_name: fullName.trim() || undefined,
          situation: situation.trim(),
          requested_tier: tier,
        }),
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
    <main className="min-h-screen bg-ivory text-plum px-6 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-medium">
            Avizaya
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light leading-tight text-plum mb-5">
            Ask, and it will be <em className="text-gold italic">given.</em>
          </h1>
          <p className="font-serif italic text-base text-muted leading-relaxed">
            Cost is not meant to be a barrier. If you genuinely cannot pay, write to me. I read
            every request myself.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="bg-white p-8 rounded-lg border border-gold/30 text-center">
            <p className="font-serif text-2xl text-plum mb-3">I received it.</p>
            <p className="text-sm text-muted leading-relaxed mb-6">
              Thank you for your honesty. I will write back to you by email.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-plum text-ivory text-sm tracking-wider uppercase hover:bg-opacity-90 transition"
            >
              Return home
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gold/30 rounded-lg bg-white text-plum placeholder-muted focus:border-gold focus:outline-none"
              disabled={status === 'sending'}
            />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-4 py-3 border border-gold/30 rounded-lg bg-white text-plum placeholder-muted focus:border-gold focus:outline-none"
              disabled={status === 'sending'}
            />
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full px-4 py-3 border border-gold/30 rounded-lg bg-white text-plum focus:border-gold focus:outline-none"
              disabled={status === 'sending'}
            >
              <option value="school">One school ($50)</option>
              <option value="coaching">A private session ($250)</option>
            </select>
            <textarea
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              placeholder="Tell me a little about where you are right now."
              rows={5}
              className="w-full px-4 py-3 border border-gold/30 rounded-lg bg-white text-plum placeholder-muted focus:border-gold focus:outline-none resize-none"
              disabled={status === 'sending'}
            />
            <button
              type="button"
              onClick={submit}
              disabled={status === 'sending'}
              className="w-full py-4 bg-plum text-ivory text-sm tracking-wider uppercase hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending...' : 'Send my request'}
            </button>
            {status === 'error' && <p className="text-sm text-red-600 text-center">{message}</p>}
            <p className="text-center text-xs text-muted pt-2">
              <Link href="/" className="text-gold underline">
                Return home
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
