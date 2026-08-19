"use client";

import { useEffect, useMemo, useState } from "react";
import AppHeader from "./AppHeader";
import { useAuth } from "./AuthProvider";

const themes = [
  "Caminhos para ampliar a educação midiática entre jovens brasileiros",
  "Desafios para a valorização da ciência no Brasil",
  "A importância da inclusão digital para o exercício da cidadania",
  "Estratégias para combater o desperdício de alimentos no Brasil",
  "O papel das cidades na promoção da mobilidade sustentável",
  "Desafios para preservar a memória cultural brasileira",
];
type Result = {
  total: number;
  summary: string;
  competencies: { code: string; score: number; feedback: string }[];
  strengths: string[];
  priorities: string[];
};

export default function SimuladoClient() {
  const { user } = useAuth();
  const [theme, setTheme] = useState(themes[0]),
    [choosing, setChoosing] = useState(false),
    [essay, setEssay] = useState(""),
    [seconds, setSeconds] = useState(5400),
    [running, setRunning] = useState(false),
    [notice, setNotice] = useState(""),
    [analyzing, setAnalyzing] = useState(false),
    [result, setResult] = useState<Result | null>(null);
  const lines = useMemo(() => (essay ? essay.split("\n").length : 0), [essay]);
  const words = useMemo(
    () => (essay.trim() ? essay.trim().split(/\s+/).length : 0),
    [essay],
  );
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            setNotice(
              "Tempo encerrado. Faça uma última revisão antes de enviar.",
            );
            return 0;
          }
          return s - 1;
        }),
      1000,
    );
    return () => window.clearInterval(id);
  }, [running]);
  const time = `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const changeEssay = (value: string) => {
    if (value.split("\n").length <= 30) setEssay(value);
    else setNotice("O limite de 30 linhas foi atingido.");
  };
  const generate = () => {
    let next = theme;
    while (next === theme)
      next = themes[Math.floor(Math.random() * themes.length)];
    setTheme(next);
    setChoosing(false);
  };
  const submit = async () => {
    if (essay.trim().length < 80) return;
    if (!user) {
      window.location.href = "/login?return_to=%2Fsimulado";
      return;
    }
    setAnalyzing(true);
    setNotice("");
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ theme, text: essay }),
      });
      const data = await response.json();
      if (response.status === 401) {
        window.location.href = "/login?return_to=%2Fsimulado";
        return;
      }
      if (!response.ok)
        throw new Error(data.error || "Não foi possível corrigir agora.");
      setResult(data);
      setRunning(false);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Erro ao corrigir a redação.",
      );
    } finally {
      setAnalyzing(false);
    }
  };
  return (
    <main className="study-page">
      <AppHeader currentPath="/simulado" />
      <div className="study-wrap">
        <section className="study-intro">
          <div>
            <p className="portal-eyebrow">MODO SIMULADO</p>
            <h1>Escreva como no dia da prova.</h1>
            <p>
              Escolha um tema, ative o tempo e produza sua redação sem anexar
              arquivos.
            </p>
          </div>
          <div className="sim-clock">
            <small>TEMPO RESTANTE</small>
            <b>{time}</b>
            <span>
              <button onClick={() => setRunning((v) => !v)}>
                {running ? "Pausar" : "Iniciar"}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setSeconds(5400);
                }}
              >
                Reiniciar
              </button>
            </span>
          </div>
        </section>
        <section className="theme-panel">
          <div>
            <small>TEMA DA REDAÇÃO</small>
            <h2>{theme}</h2>
          </div>
          <span className="theme-actions">
            <button className="primary-action" onClick={generate}>
              ✦ Gerar tema
            </button>
            <button
              className="secondary-action"
              onClick={() => setChoosing((v) => !v)}
            >
              Escolher tema
            </button>
          </span>
        </section>
        {choosing && (
          <section className="theme-choices" aria-label="Escolha um tema">
            {themes.map((item) => (
              <button
                className={item === theme ? "active" : ""}
                key={item}
                onClick={() => {
                  setTheme(item);
                  setChoosing(false);
                }}
              >
                {item}
                <span>→</span>
              </button>
            ))}
          </section>
        )}
        <section className="simulation-editor">
          <div className="editor-heading">
            <div>
              <small>FOLHA DE REDAÇÃO</small>
              <h2>Seu texto</h2>
            </div>
            <span>
              {lines}/30 linhas · {words} palavras
            </span>
          </div>
          <div className="line-editor gold-focus">
            <div className="line-numbers" aria-hidden="true">
              {Array.from({ length: 30 }, (_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <textarea
              value={essay}
              onChange={(e) => changeEssay(e.target.value)}
              placeholder="Comece sua redação aqui. Use Enter para avançar uma linha..."
            />
          </div>
          <footer>
            <p>Somente texto digitado durante o simulado.</p>
            <button
              className="primary-action submit-sim"
              disabled={essay.trim().length < 80 || analyzing}
              onClick={submit}
            >
              {analyzing
                ? "Analisando..."
                : user
                  ? "Finalizar e corrigir"
                  : "Entrar para corrigir"}{" "}
              →
            </button>
          </footer>
        </section>
        {notice && <p className="inline-notice">{notice}</p>}
        {result && (
          <section className="sim-result">
            <div>
              <small>RESULTADO DO SIMULADO</small>
              <h2>
                {result.total}
                <span>/1000</span>
              </h2>
              <p>{result.summary}</p>
            </div>
            <div className="result-bars">
              {result.competencies.map((c) => (
                <span key={c.code}>
                  <b>{c.code}</b>
                  <progress value={c.score} max="200" />
                  <strong>{c.score}</strong>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
