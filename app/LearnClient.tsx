"use client";
import { useState } from "react";
import Link from "next/link";
import AppHeader from "./AppHeader";

type Area = "competencias" | "estrutura" | "repertorios";
const content = {
  competencias: {
    eyebrow: "AS 5 COMPETÊNCIAS",
    title: "Entenda como sua nota é construída",
    intro:
      "Cada competência vale até 200 pontos. Aprenda o que observar na revisão.",
    cards: [
      [
        "C1",
        "Domínio da escrita formal",
        "Ortografia, pontuação, concordância e escolha vocabular.",
      ],
      [
        "C2",
        "Compreensão do tema",
        "Atendimento ao recorte proposto e uso produtivo de repertório.",
      ],
      [
        "C3",
        "Projeto de texto",
        "Seleção, organização e defesa consistente dos argumentos.",
      ],
      ["C4", "Coesão", "Conexão clara entre frases, períodos e parágrafos."],
      [
        "C5",
        "Proposta de intervenção",
        "Agente, ação, meio, finalidade e detalhamento com respeito aos direitos humanos.",
      ],
    ],
  },
  estrutura: {
    eyebrow: "ESTRUTURA DA REDAÇÃO",
    title: "Organize suas ideias antes de escrever",
    intro:
      "Uma estrutura consciente deixa o raciocínio claro e protege o tempo de prova.",
    cards: [
      [
        "01",
        "Introdução",
        "Apresente o tema, contextualize e formule uma tese com dois eixos de discussão.",
      ],
      [
        "02",
        "Desenvolvimento 1",
        "Defenda o primeiro eixo com argumento, explicação, repertório e conexão com o tema.",
      ],
      [
        "03",
        "Desenvolvimento 2",
        "Aprofunde o segundo eixo sem repetir o raciocínio do parágrafo anterior.",
      ],
      [
        "04",
        "Conclusão",
        "Retome a tese e construa uma proposta de intervenção completa e viável.",
      ],
    ],
  },
  repertorios: {
    eyebrow: "REPERTÓRIOS",
    title: "Use referências que realmente argumentam",
    intro:
      "O repertório forte é pertinente, explicado e conectado à sua tese — não apenas citado.",
    cards: [
      [
        "SOC",
        "Constituição Federal",
        "Direitos, cidadania, igualdade e deveres do Estado.",
      ],
      [
        "HIS",
        "Formação histórica",
        "Processos históricos ajudam a explicar a origem de desafios atuais.",
      ],
      [
        "CIE",
        "Dados e pesquisa",
        "Estudos confiáveis sustentam relações de causa, impacto e urgência.",
      ],
      [
        "ART",
        "Obras culturais",
        "Livros, filmes e artes podem ilustrar ideias quando há conexão explícita.",
      ],
    ],
  },
};

export default function LearnClient() {
  const [area, setArea] = useState<Area>("competencias");
  const current = content[area];
  return (
    <main className="study-page learn-page">
      <AppHeader currentPath="/aprender" />
      <div className="learn-wrap">
        <section className="study-intro">
          <div>
            <p className="portal-eyebrow">APRENDER E MELHORAR</p>
            <h1>Construa uma redação mais forte.</h1>
            <p>
              Escolha um assunto e transforme teoria em decisões práticas de
              escrita.
            </p>
          </div>
        </section>
        <nav className="learn-tabs" aria-label="Conteúdos de aprendizagem">
          <button
            className={area === "competencias" ? "active" : ""}
            onClick={() => setArea("competencias")}
          >
            <span>01</span>Competências
          </button>
          <button
            className={area === "estrutura" ? "active" : ""}
            onClick={() => setArea("estrutura")}
          >
            <span>02</span>Estrutura
          </button>
          <button
            className={area === "repertorios" ? "active" : ""}
            onClick={() => setArea("repertorios")}
          >
            <span>03</span>Repertórios
          </button>
        </nav>
        <section className="learn-content">
          <div className="learn-heading">
            <p className="portal-eyebrow">{current.eyebrow}</p>
            <h2>{current.title}</h2>
            <p>{current.intro}</p>
          </div>
          <div className="lesson-grid">
            {current.cards.map((card) => (
              <article key={card[0]}>
                <span>{card[0]}</span>
                <div>
                  <h3>{card[1]}</h3>
                  <p>{card[2]}</p>
                </div>
              </article>
            ))}
          </div>
          <Link className="primary-action learn-cta" href="/simulado">
            Praticar em um simulado →
          </Link>
        </section>
      </div>
    </main>
  );
}
