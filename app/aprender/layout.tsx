import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aprender redação | Nota 1000",
  robots: { index: false, follow: false },
};
export default function LearnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
