import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase';
import type { School } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Public page. Anyone can browse and choose a school before logging in.
// It shows every published school as buyable, and every coming-soon school
// as a quiet preview. When you publish School 2, 3, ... they appear here
// automatically. No code change needed.

export default async function SchoolsPage() {
  const supabase = createServerSupabaseClient();
  const { data: schools } = await supabase
    .from('schools')
    .select('*')
    .or('is_published.eq.true,is_coming_soon.eq.true')
    .order('display_order', { ascending: true });

  const available = (schools || []).filter((s: School) => s.is_published);
  const comingSoon = (schools || []).filter(
    (s: School) => s.is_coming_soon && !s.is_published
  );

  return (
    <main className="min-h-screen bg-ivory text-plum px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-3 font-medium">
            Avizaya
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-plum mb-4">
            Choose your school.
          </h1>
          <p className="font-serif italic text-lg text-muted max-w-xl mx-auto">
            Each school is yours forever once you begin. $50 each.
          </p>
        </div>

        {/* Available schools */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {available.map((school: School) => {
            const bg = school.cover_color === 'green' ? 'bg-green' : 'bg-plum';
            return (
              <div key={school.id} className={`${bg} rounded-lg p-8 flex flex-col`}>
                <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-medium">
                  {school.subtitle} · {school.total_episodes} episodes
                </p>
                <h2 className="font-serif text-2xl text-ivory mb-4 leading-tight">
                  {school.title}
                </h2>
                <p className="font-serif italic text-sm text-ivory text-opacity-90 leading-relaxed mb-6 flex-1">
                  {school.tagline}
                </p>
                <Link
                  href={`/checkout/school?id=${school.id}`}
                  className="inline-block w-full text-center py-3 bg-gold text-plum text-sm tracking-wider uppercase hover:bg-opacity-90 transition"
                >
                  Choose this · ${(school.price_cents / 100).toFixed(0)}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Coming soon */}
        {comingSoon.length > 0 && (
          <div className="mt-16">
            <p className="text-[10px] tracking-[0.25em] uppercase text-gold mb-6 font-medium text-center">
              More schools are coming
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoon.map((school: School) => {
                const bg = school.cover_color === 'green' ? 'bg-green' : 'bg-plum';
                return (
                  <div
                    key={school.id}
                    className={`${bg} bg-opacity-90 rounded-lg p-8 opacity-60`}
                  >
                    <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-medium">
                      {school.subtitle} · Coming soon
                    </p>
                    <h2 className="font-serif text-2xl text-ivory mb-3 leading-tight">
                      {school.title}
                    </h2>
                    <p className="font-serif italic text-sm text-ivory text-opacity-70 leading-relaxed">
                      {school.tagline}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-center text-sm text-muted mt-16">
          Already have an account?{' '}
          <Link href="/login" className="text-gold underline">
            Sign in
          </Link>
          {'  ·  '}
          <Link href="/" className="text-gold underline">
            Return home
          </Link>
        </p>
      </div>
    </main>
  );
}
