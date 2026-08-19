"use client";

import Link from "next/link";
import AppHeader from "./AppHeader";
import { useAuth } from "./AuthProvider";
import { useEssayStats } from "./useEssayStats";

const actions = [
  {
    number: "01",
    title: "Corrigir redação",
    description:
      "Digite, cole ou envie uma foto/PDF e receba uma análise pelas cinco competências do ENEM.",
    destination: "/correcao",
    label: "Começar correção",
    icon: "✦",
  },
  {
    number: "02",
    title: "Simulado",
    description:
      "Receba um tema, escreva na hora em até 30 linhas e treine com o cronômetro de 1h30.",
    destination: "/simulado",
    label: "Iniciar simulado",
    icon: "◷",
  },
  {
    number: "03",
    title: "Aprender e melhorar",
    description:
      "Estude competências, estrutura da redação e repertórios para evoluir com estratégia.",
    destination: "/aprender",
    label: "Abrir trilha de estudo",
    icon: "↗",
  },
];
const demoCompetence = [180, 172, 154, 166, 154];
const demoRecent = [
  { theme: "Desafios da inclusão digital", score: 860, date: "16 ago" },
  { theme: "Valorização da ciência", score: 840, date: "10 ago" },
  { theme: "Mobilidade urbana sustentável", score: 820, date: "03 ago" },
];

function PerformanceRadar({ competence }: { competence: number[] }) {
  const center = 95,
    r = 67,
    point = (i: number, value: number) => {
      const angle = -Math.PI / 2 + (i * Math.PI * 2) / 5;
      return `${center + Math.cos(angle) * r * value},${center + Math.sin(angle) * r * value}`;
    };
  return (
    <svg
      className="control-radar"
      viewBox="0 0 190 190"
      role="img"
      aria-label="Mapa das cinco competências"
    >
      <polygon
        className="radar-base"
        points={competence.map((_, i) => point(i, 1)).join(" ")}
      />
      {competence.map((_, i) => (
        <line
          key={i}
          x1="95"
          y1="95"
          x2={point(i, 1).split(",")[0]}
          y2={point(i, 1).split(",")[1]}
        />
      ))}
      <polygon
        className="radar-fill"
        points={competence.map((v, i) => point(i, v / 200)).join(" ")}
      />
      {competence.map((_, i) => (
        <text
          key={i}
          x={point(i, 1.18).split(",")[0]}
          y={point(i, 1.18).split(",")[1]}
        >
          C{i + 1}
        </text>
      ))}
    </svg>
  );
}

export default function HomeLanding() {
  const { user, displayName } = useAuth();
  const { essays, average, competencyAverages } = useEssayStats();
  const hasResults = essays.length > 0;
  const competence = hasResults ? competencyAverages : demoCompetence;
  const currentAverage = hasResults ? average : 826;
  const recent = hasResults
    ? essays
        .slice(0, 3)
        .map((essay) => ({
          theme: essay.theme || "Redação ENEM",
          score: essay.total,
          date:
            essay.createdAt
              ?.toDate()
              .toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              }) ?? "agora",
        }))
    : demoRecent;
  return (
    <main className="portal-page">
      <AppHeader currentPath="/inicio" large />
      <section className="portal-hero">
        <p className="portal-eyebrow">PREPARAÇÃO PARA REDAÇÃO ENEM</p>
        <h1>
          Sua plataforma para <span>passar no ENEM</span>
        </h1>
        <p>
          Escolha um caminho para praticar, receber uma correção ou fortalecer
          sua base.
        </p>
      </section>
      <section className="portal-actions" aria-label="Áreas de estudo">
        {actions.map((action) => {
          const href = user
            ? action.destination
            : `/login?return_to=${encodeURIComponent(action.destination)}`;
          return (
            <Link
              className="portal-action"
              href={href}
              key={action.destination}
            >
              <div className="portal-action-top">
                <small>{action.number}</small>
                <i>{action.icon}</i>
              </div>
              <h2>{action.title}</h2>
              <p>{action.description}</p>
              <span>
                {action.label}
                <b>→</b>
              </span>
            </Link>
          );
        })}
      </section>
      <section className="control-center" id="central">
        <div className="control-title">
          <div>
            <p className="portal-eyebrow">CENTRAL DE CONTROLE</p>
            <h2>Seu desempenho no ENEM</h2>
          </div>
          <span>
            {user
              ? `Visão de ${displayName.split(" ")[0]}`
              : "Dados de demonstração"}
          </span>
        </div>
        <div className="control-grid">
          <article className="control-card radar-card">
            <div>
              <small>MAPA DE DESEMPENHO</small>
              <h3>5 competências</h3>
            </div>
            <div className="radar-content">
              <PerformanceRadar competence={competence} />
              <div>
                {competence.map((score, index) => (
                  <span key={index}>
                    <i>C{index + 1}</i>
                    <progress value={score} max="200" />
                    <b>{score}</b>
                  </span>
                ))}
              </div>
            </div>
          </article>
          <article className="control-card average-card">
            <small>MÉDIA DAS ÚLTIMAS 5</small>
            <strong>{currentAverage}</strong>
            <span>/1000 pontos</span>
            <p>
              {hasResults
                ? `${essays.length} resultado${essays.length > 1 ? "s" : ""} salvo${essays.length > 1 ? "s" : ""}`
                : "Exemplo de desempenho"}
            </p>
            <div className="score-spark">
              {(hasResults
                ? [...essays].reverse().map((item) => item.total)
                : [788, 804, 820, 840, 860]
              ).map((value, index) => (
                <i
                  key={`${value}-${index}`}
                  style={{ height: `${Math.max(10, (value - 700) / 2.2)}%` }}
                >
                  <b>{index + 1}</b>
                </i>
              ))}
            </div>
          </article>
          <article className="control-card goal-control">
            <small>META ATUAL</small>
            <h3>900+ pontos</h3>
            <p>
              Faltam <b>{Math.max(0, 900 - currentAverage)} pontos</b> para
              alcançar sua meta.
            </p>
            <div className="goal-ring">
              <span>{Math.round(currentAverage / 10)}%</span>
            </div>
            <progress value={currentAverage} max="1000" />
          </article>
          <article className="control-card consistency-card">
            <small>CONSTÂNCIA DE ESTUDO</small>
            <h3>5 dias nesta semana</h3>
            <div className="control-week">
              {["S", "T", "Q", "Q", "S", "S", "D"].map((day, index) => (
                <span
                  className={index < 5 ? "done" : index === 5 ? "today" : ""}
                  key={index}
                >
                  <i>{index < 5 ? "✓" : index + 1}</i>
                  <b>{day}</b>
                </span>
              ))}
            </div>
            <p>
              Próxima recompensa: <b>7 dias consecutivos</b>
            </p>
          </article>
          <article className="control-card recent-control">
            <div>
              <small>ÚLTIMOS RESULTADOS</small>
              <h3>Redações recentes</h3>
            </div>
            {recent.map((item) => (
              <div className="recent-control-row" key={item.theme}>
                <span>
                  <b>{item.theme}</b>
                  <small>{item.date}</small>
                </span>
                <strong>{item.score}</strong>
              </div>
            ))}
            <Link href={user ? "/correcao" : "/login?return_to=%2Fcorrecao"}>
              Escrever nova redação →
            </Link>
          </article>
          <article className="control-card focus-card">
            <small>FOCO RECOMENDADO</small>
            <h3>Competência 3</h3>
            <p>
              Organize melhor a progressão dos argumentos e conecte cada
              repertório à tese.
            </p>
            <Link href={user ? "/aprender" : "/login?return_to=%2Faprender"}>
              Estudar argumentação →
            </Link>
          </article>
        </div>
      </section>
      <footer className="portal-foot">
        <span>✓ Padrão ENEM</span>
        <span>✓ Correção por competência</span>
        <span>✓ Progresso organizado</span>
      </footer>
    </main>
  );
}
