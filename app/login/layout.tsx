import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar | Nota 1000",
  robots: { index: false, follow: false },
};
export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
