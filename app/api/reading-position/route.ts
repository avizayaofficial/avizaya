import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { episode_id, scroll_percent, font_size_px } = body;

    if (
      typeof episode_id !== 'number' ||
      typeof scroll_percent !== 'number' ||
      typeof font_size_px !== 'number'
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Clamp values defensively
    const clampedScroll = Math.min(100, Math.max(0, scroll_percent));
    const clampedFont = Math.min(24, Math.max(14, font_size_px));

    const { error } = await supabase
      .from('reading_positions')
      .upsert(
        {
          user_id: user.id,
          episode_id,
          scroll_percent: clampedScroll,
          font_size_px: clampedFont,
          last_read_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,episode_id' }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
