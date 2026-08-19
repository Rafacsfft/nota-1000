"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import AppHeader from "../AppHeader";
import { useAuth } from "../AuthProvider";
import { auth } from "@/lib/firebase/client";

const destinations: Record<string, { title: string; description: string }> = {
  "/correcao": {
    title: "Corrigir redação",
    description: "Envie ou digite seu texto e receba uma análise completa.",
  },
  "/simulado": {
    title: "Iniciar simulado",
    description: "Treine com tema, 30 linhas e cronômetro de prova.",
  },
  "/aprender": {
    title: "Aprender e melhorar",
    description: "Acesse competências, estrutura e repertórios.",
  },
  "/inicio": {
    title: "Página inicial",
    description: "Acompanhe seu desempenho e escolha seu próximo treino.",
  },
};

function safeDestination(value: string | null) {
  return value && destinations[value] ? value : "/inicio";
}

function LoginContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, configured } = useAuth();
  const destination = safeDestination(params.get("return_to"));
  const choice = destinations[destination];
  const [createMode, setCreateMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function withFeedback(action: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await action();
      router.replace(destination);
    } catch (error) {
      const code =
        typeof error === "object" && error && "code" in error
          ? String(error.code)
          : "";
      const messages: Record<string, string> = {
        "auth/invalid-credential": "E-mail ou senha incorretos.",
        "auth/email-already-in-use": "Este e-mail já possui uma conta.",
        "auth/weak-password": "Crie uma senha com pelo menos 6 caracteres.",
        "auth/popup-closed-by-user":
          "A janela do Google foi fechada antes de concluir.",
      };
      setMessage(
        messages[code] ??
          "Não foi possível concluir o acesso. Tente novamente.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const firebaseAuth = auth;
    if (!firebaseAuth)
      return setMessage("Configure o Firebase antes de usar o login.");
    await withFeedback(async () => {
      if (createMode) {
        const credential = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          password,
        );
        if (name.trim())
          await updateProfile(credential.user, { displayName: name.trim() });
      } else await signInWithEmailAndPassword(firebaseAuth, email, password);
    });
  }

  async function googleLogin() {
    const firebaseAuth = auth;
    if (!firebaseAuth)
      return setMessage("Configure o Firebase antes de usar o login.");
    await withFeedback(async () => {
      await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    });
  }

  async function resetPassword() {
    if (!auth || !email)
      return setMessage("Digite seu e-mail para recuperar a senha.");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Enviamos o link de recuperação para seu e-mail.");
    } catch {
      setMessage("Não foi possível enviar o link agora.");
    }
  }

  return (
    <section className="login-card">
      <Link className="login-brand" href="/">
        <span>N</span>
        <strong>
          nota<em>1000</em>
        </strong>
      </Link>
      <p className="portal-eyebrow">ACESSO SEGURO</p>
      <h1>
        {user
          ? "Sua conta já está conectada."
          : createMode
            ? "Crie sua conta gratuita"
            : "Entre na Nota 1000"}
      </h1>
      <p className="login-copy">
        Seu histórico, suas metas e suas correções ficam vinculados à sua conta.
      </p>
      <div className="login-destination">
        <span>Você escolheu</span>
        <strong>{choice.title}</strong>
        <small>{choice.description}</small>
      </div>
      {!configured && (
        <p className="login-warning">
          O Firebase ainda não foi configurado neste ambiente.
        </p>
      )}
      {user ? (
        <Link className="login-primary" href={destination}>
          Continuar →
        </Link>
      ) : (
        <>
          <button
            type="button"
            className="login-provider google"
            onClick={googleLogin}
            disabled={busy}
          >
            <span>G</span> Continuar com Google
          </button>
          <div className="login-divider">
            <span>ou use seu e-mail</span>
          </div>
          <form className="login-form" onSubmit={submit}>
            {createMode && (
              <label>
                Nome ou apelido
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </label>
            )}
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={createMode ? "new-password" : "current-password"}
                minLength={6}
                required
              />
            </label>
            <button className="login-primary" disabled={busy}>
              {busy ? "Aguarde..." : createMode ? "Criar conta" : "Entrar"}
            </button>
          </form>
          {!createMode && (
            <button className="login-text-button" onClick={resetPassword}>
              Esqueci minha senha
            </button>
          )}
          <button
            className="login-secondary"
            onClick={() => {
              setCreateMode((value) => !value);
              setMessage("");
            }}
          >
            {createMode ? "Já tenho uma conta" : "Criar conta com e-mail"}
          </button>
        </>
      )}
      {message && (
        <p className="login-message" role="status">
          {message}
        </p>
      )}
      <p className="login-security">
        🔒 Login protegido pelo Firebase. A Nota 1000 não armazena sua senha.
      </p>
      <p className="login-legal">
        Ao continuar, você concorda com os{" "}
        <Link href="/termos">Termos de Uso</Link> e a{" "}
        <Link href="/privacidade">Política de Privacidade</Link>.
      </p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <main className="login-page">
      <AppHeader currentPath="/login" />
      <Suspense
        fallback={
          <section className="login-card">
            <p>Carregando acesso...</p>
          </section>
        }
      >
        <LoginContent />
      </Suspense>
    </main>
  );
}
