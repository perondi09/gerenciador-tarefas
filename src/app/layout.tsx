import { TRPCProvider } from '@/trpc/client';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ maxWidth: 640, margin: '0 auto', padding: 24, fontFamily: 'sans-serif' }}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}