import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nota 1000 — Laboratório de redação ENEM",
  description: "Compreenda as cinco competências do ENEM e transforme feedback em um plano de revisão.",
  other: {
    "codex-preview": "development",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
