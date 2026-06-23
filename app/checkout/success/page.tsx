import Link from 'next/link';
import { Suspense } from 'react';

function SuccessInner({
  searchParams,
}: {
  searchParams: { kind?: string; slug?: string };
}) {
  const kind = searchParams.kind;
  const slug = searchParams.slug;

  let heading = 'Payment received.';
  let body =
    'Your access is being unlocked. This takes a few seconds. Open your library and it will be there.';
  let primaryHref = '/library';
  let primaryLabel = 'Go to my library';

  if (kind === 'school' && slug) {
    heading = 'It is yours now.';
    body =
      'Your school is unlocked, permanently. If the first episode does not open right away, give it a few seconds and refresh.';
    primaryHref = `/read/${slug}/1`;
    primaryLabel = 'Begin reading';
  } else if (kind === 'subscription') {
    heading = 'Welcome in.';
    body =
      'Your monthly access is active. Every published school is open to you. Begin with The Abandoned Girl.';
  } else if (kind === 'coaching') {
    heading = 'Your session is reserved.';
    body =
      'Payment received. Dina will reach out by email to schedule your private session. Watch your inbox.';
    primaryHref = '/';
    primaryLabel = 'Return home';
  }

  return (
    <main className="min-h-screen bg-ivory text-plum flex items-center justify-center px-8">
      <div className="max-w-md text-center">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-6 font-medium">
          Avizaya
        </p>
        <div className="flex items-center gap-4 max-w-[12rem] mx-auto mb-8">
          <div className="flex-1 h-px bg-gold opacity-40" />
          <div className="w-1.5 h-1.5 bg-gold rotate-45" />
          <div className="flex-1 h-px bg-gold opacity-40" />
        </div>
        <h1 className="font-serif text-4xl font-light text-plum mb-5">{heading}</h1>
        <p className="font-serif italic text-lg text-muted leading-relaxed mb-10">{body}</p>
        <Link
          href={primaryHref}
          className="inline-block px-10 py-4 bg-plum text-ivory text-sm tracking-wider uppercase hover:bg-opacity-90 transition"
        >
          {primaryLabel}
        </Link>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { kind?: string; slug?: string };
}) {
  return (
    <Suspense>
      <SuccessInner searchParams={searchParams} />
    </Suspense>
  );
}
