import './globals.css';

export const metadata = {
  title: 'Personal AI Chat Assistant',
  description: 'Personal AI chat assistant built with Next.js App Router',
};

// Fungsi RootLayout membungkus seluruh halaman aplikasi dengan struktur HTML dasar.
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
