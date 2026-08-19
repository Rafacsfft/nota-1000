import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corrigir redação | Nota 1000",
  robots: { index: false, follow: false },
};
export default function CorrectionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
