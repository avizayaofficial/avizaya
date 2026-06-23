import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const intent = searchParams.get('intent'); // 'school' | 'coaching' | 'subscribe'
  const school = searchParams.get('school'); // school id, when they picked one

  if (code) {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Picked a specific school before logging in: go straight to its checkout.
      if (intent === 'school' && school) {
        return NextResponse.redirect(`${origin}/checkout/school?id=${encodeURIComponent(school)}`);
      }
      // Wanted a school but did not pick one yet: show the selection page.
      if (intent === 'school') {
        return NextResponse.redirect(`${origin}/schools`);
      }
      if (intent === 'coaching') {
        return NextResponse.redirect(`${origin}/checkout/coaching`);
      }
      // 'subscribe' is reserved for when monthly is switched on later.
      if (intent === 'subscribe') {
        return NextResponse.redirect(`${origin}/checkout/subscribe`);
      }
      return NextResponse.redirect(`${origin}/library`);
    }
  }

  // Auth failed - back to login with error indicator
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
