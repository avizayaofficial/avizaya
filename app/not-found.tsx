import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ivory text-plum flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-4 font-medium">
          Avizaya
        </p>
        <h1 className="font-serif text-5xl font-light text-plum mb-4">Not found.</h1>
        <p className="font-serif italic text-lg text-muted mb-8">
          This page does not exist, or it is not yet open to you.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-plum text-ivory text-sm tracking-wider uppercase hover:bg-opacity-90 transition"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
