"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function AppHeader({
  currentPath = "/inicio",
  large = false,
  logoClickable = true,
}: {
  currentPath?: string;
  large?: boolean;
  logoClickable?: boolean;
}) {
  const { user, displayName, loading } = useAuth();
  const logoContent = (
    <>
      <span>N</span>
      <strong>
        nota<em>1000</em>
      </strong>
    </>
  );
  return (
    <header className="app-header">
      {logoClickable ? (
        <Link
          className={`portal-logo ${large ? "brand-large" : ""}`}
          href="/inicio"
          aria-label="Nota 1000 — página inicial"
        >
          {logoContent}
        </Link>
      ) : (
        <span
          className={`portal-logo ${large ? "brand-large" : ""}`}
          aria-label="Nota 1000"
        >
          {logoContent}
        </span>
      )}
      <div className="header-account">
        {user ? (
          <>
            <details className="notifications">
              <summary aria-label="Notificações">
                🔔
                <i />
              </summary>
              <div>
                <b>Notificações</b>
                <p>Meta diária pronta para começar.</p>
                <p>Seu foco sugerido é a Competência 3.</p>
              </div>
            </details>
            <Link
              className="header-profile"
              href="/perfil"
              aria-label="Abrir perfil"
            >
              <span>{displayName.slice(0, 2).toUpperCase()}</span>
              <div>
                <small>Conta conectada</small>
                <b>{displayName.split(" ")[0]}</b>
              </div>
            </Link>
          </>
        ) : (
          !loading && (
            <Link
              className="header-login"
              href={`/login?return_to=${encodeURIComponent(currentPath)}`}
            >
              Entrar ou cadastrar
            </Link>
          )
        )}
      </div>
    </header>
  );
}
