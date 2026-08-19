import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meu perfil | Nota 1000",
  robots: { index: false, follow: false },
};
export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
