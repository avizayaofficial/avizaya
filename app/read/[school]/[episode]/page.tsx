import { redirect, notFound } from 'next/navigation';
import { createServerSupabaseClient, canAccessSchool } from '@/lib/supabase';
import Reader from '@/components/Reader';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { school: string; episode: string };
}

export default async function ReadPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Look up school by slug
  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', params.school)
    .eq('is_published', true)
    .maybeSingle();

  if (!school) {
    notFound();
  }

  // Check access
  const { hasAccess } = await canAccessSchool(user.id, school.id);
  if (!hasAccess) {
    redirect(`/checkout/school?id=${school.id}`);
  }

  // Look up episode by number within school
  const episodeNumber = parseInt(params.episode, 10);
  const { data: episode } = await supabase
    .from('episodes')
    .select('*')
    .eq('school_id', school.id)
    .eq('episode_number', episodeNumber)
    .eq('is_published', true)
    .maybeSingle();

  if (!episode) {
    notFound();
  }

  // Get saved reading position
  const { data: position } = await supabase
    .from('reading_positions')
    .select('scroll_percent, font_size_px')
    .eq('user_id', user.id)
    .eq('episode_id', episode.id)
    .maybeSingle();

  return (
    <Reader
      htmlContent={episode.html_content}
      episodeId={episode.id}
      initialScrollPercent={position?.scroll_percent ?? 0}
      initialFontSizePx={position?.font_size_px ?? 16}
    />
  );
}
