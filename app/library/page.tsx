import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient, canAccessSchool } from '@/lib/supabase';
import type { School } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all schools ordered by display_order
  const { data: schools } = await supabase
    .from('schools')
    .select('*')
    .order('display_order', { ascending: true });

  // For each school, check user's access
  const schoolsWithAccess = await Promise.all(
    (schools || []).map(async (school: School) => {
      const { hasAccess, reason } = await canAccessSchool(user.id, school.id);
      return { ...school, hasAccess, accessReason: reason };
    })
  );

  return (
    <main className="min-h-screen bg-ivory text-plum px-8 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-3 font-medium">
            Avizaya
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-plum mb-4">
            The library.
          </h1>
          <p className="font-serif italic text-lg text-muted max-w-xl mx-auto">
            Every school is a journey. Begin with The Abandoned Girl.
          </p>
        </div>

        {/* Account link */}
        <div className="flex justify-end mb-8">
          <Link
            href="/account"
            className="text-xs tracking-wider uppercase text-muted hover:text-gold transition"
          >
            Account
          </Link>
        </div>

        {/* School tiles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schoolsWithAccess.map((school) => (
            <SchoolTile key={school.id} school={school} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted mt-16">
          Schools are added over time. New schools appear here as they are
          released.
        </p>
      </div>
    </main>
  );
}

// ─── SCHOOL TILE COMPONENT ──────────────────────────────────
function SchoolTile({
  school,
}: {
  school: School & { hasAccess: boolean; accessReason: string };
}) {
  const isComingSoon = school.is_coming_soon && !school.is_published;
  const bgColor = school.cover_color === 'green' ? 'bg-green' : 'bg-plum';

  if (isComingSoon) {
    return (
      <div className={`${bgColor} bg-opacity-90 rounded-lg p-8 opacity-60 cursor-default`}>
        <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-medium">
          {school.subtitle} · Coming soon
        </p>
        <h2 className="font-serif text-2xl text-ivory mb-4 leading-tight">
          {school.title}
        </h2>
        <p className="font-serif italic text-sm text-ivory text-opacity-70 leading-relaxed">
          {school.tagline}
        </p>
      </div>
    );
  }

  if (school.hasAccess) {
    return (
      <Link
        href={`/read/${school.slug}/1`}
        className={`block ${bgColor} rounded-lg p-8 hover:shadow-lg transition`}
      >
        <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-medium">
          {school.subtitle} · {school.total_episodes} episodes
        </p>
        <h2 className="font-serif text-2xl text-ivory mb-4 leading-tight">
          {school.title}
        </h2>
        <p className="font-serif italic text-sm text-ivory text-opacity-90 leading-relaxed mb-4">
          {school.tagline}
        </p>
        <p className="text-xs tracking-wider uppercase text-gold">Begin reading →</p>
      </Link>
    );
  }

  // Published but user has no access - show purchase option
  return (
    <div className={`${bgColor} rounded-lg p-8`}>
      <p className="text-[10px] tracking-[0.22em] uppercase text-gold mb-3 font-medium">
        {school.subtitle} · {school.total_episodes} episodes
      </p>
      <h2 className="font-serif text-2xl text-ivory mb-4 leading-tight">
        {school.title}
      </h2>
      <p className="font-serif italic text-sm text-ivory text-opacity-90 leading-relaxed mb-6">
        {school.tagline}
      </p>
      <Link
        href={`/checkout/school?id=${school.id}`}
        className="inline-block w-full text-center py-3 bg-gold text-plum text-sm tracking-wider uppercase hover:bg-opacity-90 transition"
      >
        Unlock for ${(school.price_cents / 100).toFixed(0)}
      </Link>
    </div>
  );
}
