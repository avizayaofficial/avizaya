import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Avizaya',
  description: 'A women\'s transformation program. Biblical depth. Real healing. Soft and powerful.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://avizaya.com'),
  openGraph: {
    title: 'Avizaya',
    description: 'A women\'s transformation program.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
