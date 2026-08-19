"use client";

import { useState } from "react";
import AppHeader from "../AppHeader";
import ProtectedPage from "../ProtectedPage";
import { useAuth } from "../AuthProvider";
import { useEssayStats } from "../useEssayStats";

function ProfileContent() {
  const { user, displayName, logout } = useAuth();
  const { essays, average } = useEssayStats();
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  async function deleteAccount() {
    if (
      !user ||
      !window.confirm(
        "Excluir definitivamente sua conta e seu histórico? Esta ação não pode ser desfeita.",
      )
    )
      return;
    setDeleting(true);
    setMessage("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      await logout();
      window.location.href = "/";
    } catch {
      setMessage(
        "Não foi possível excluir a conta agora. Entre novamente e tente outra vez.",
      );
      setDeleting(false);
    }
  }

  return (
    <main className="profile-page">
      <AppHeader currentPath="/perfil" />
      <section className="profile-panel">
        <div className="profile-avatar-large">
          {displayName.slice(0, 2).toUpperCase()}
        </div>
        <p className="portal-eyebrow">SEU PERFIL</p>
        <h1>{displayName}</h1>
        <p>{user?.email}</p>
        <div className="profile-stats">
          <span>
            <b>{essays.length}</b>
            <small>últimas redações</small>
          </span>
          <span>
            <b>{average || "—"}</b>
            <small>média atual</small>
          </span>
          <span>
            <b>900+</b>
            <small>meta atual</small>
          </span>
        </div>
        <button
          className="profile-signout"
          onClick={async () => {
            await logout();
            window.location.href = "/";
          }}
        >
          Sair da conta
        </button>
        <button
          className="profile-delete"
          disabled={deleting}
          onClick={deleteAccount}
        >
          {deleting ? "Excluindo..." : "Excluir conta e dados"}
        </button>
        {message && <p className="field-error">{message}</p>}
      </section>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedPage>
      <ProfileContent />
    </ProtectedPage>
  );
}
