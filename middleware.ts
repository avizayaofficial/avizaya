import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refresh session if it exists. This sets cookies if needed.
  const { data: { user } } = await supabase.auth.getUser();

  // Protected routes: require authentication.
  // NOTE: /checkout is intentionally NOT here. The checkout routes guard
  // themselves and redirect to /login while preserving the chosen school,
  // which middleware cannot do (it would drop the ?id=).
  const isProtected =
    request.nextUrl.pathname.startsWith('/library') ||
    request.nextUrl.pathname.startsWith('/read') ||
    request.nextUrl.pathname.startsWith('/account');

  if (isProtected && !user) {
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - api/webhook/* (Stripe webhooks must not pass through auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhook).*)',
  ],
};
