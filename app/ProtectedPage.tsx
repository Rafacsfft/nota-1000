"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, configured } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (configured && !loading && !user)
      router.replace(`/login?return_to=${encodeURIComponent(pathname)}`);
  }, [configured, loading, user, pathname, router]);

  if (!configured)
    return (
      <main className="login-page">
        <section className="login-card">
          <h1>Configure o Firebase</h1>
          <p className="login-copy">
            Adicione as variáveis do arquivo .env.example para ativar login e
            dados.
          </p>
        </section>
      </main>
    );
  if (loading || !user)
    return (
      <main className="login-page">
        <section className="login-card">
          <p>Carregando sua conta...</p>
        </section>
      </main>
    );
  return children;
}
