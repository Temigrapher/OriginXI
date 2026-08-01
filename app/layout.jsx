import './globals.css';

export const metadata = {
  title: 'Origin XI — Same Badge. New Season.',
  description: 'Curated. Authenticated. Celebrated. Current-season club jerseys, delivered across Lagos, Ibadan, and nationwide.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
