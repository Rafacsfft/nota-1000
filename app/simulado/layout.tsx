import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulado de redação | Nota 1000",
  robots: { index: false, follow: false },
};
export default function SimulationLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
