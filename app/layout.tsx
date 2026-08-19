import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./AuthProvider";

export const metadata: Metadata = {
  title: "Nota 1000 — Correção inteligente de redações",
  description:
    "Corrija redações pelas cinco competências do ENEM e acompanhe sua evolução.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  openGraph: {
    title: "Nota 1000 — Redação ENEM",
    description:
      "Treine, corrija e acompanhe sua evolução nas cinco competências do ENEM.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
