import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  async function signOut() {
    'use server';
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-ivory text-plum px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-3 font-medium">
          Avizaya
        </p>
        <h1 className="font-serif text-4xl font-light text-plum mb-2">Your account.</h1>
        <p className="text-sm text-muted mb-12">{user.email}</p>

        <div className="space-y-6 bg-white p-8 rounded-lg border border-gold/30">
          <div>
            <p className="text-xs tracking-wider uppercase text-gold mb-1">Email</p>
            <p className="text-plum">{user.email}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider uppercase text-gold mb-1">Member since</p>
            <p className="text-plum">
              {new Date(user.created_at!).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/library"
            className="px-6 py-3 bg-plum text-ivory text-sm tracking-wider uppercase hover:bg-opacity-90 transition"
          >
            Back to library
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="px-6 py-3 border border-plum text-plum text-sm tracking-wider uppercase hover:bg-plum hover:text-ivory transition"
            >
              Sign out
            </button>
          </form>
        </div>

        <p className="text-xs text-muted mt-12">
          Subscription management, purchase history, and coaching bookings will
          appear here in a future update.
        </p>
      </div>
    </main>
  );
}
