"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import AppHeader from "./AppHeader";

const resources = [
  {
    number: "01",
    title: "Correção por competência",
    text: "Veja sua nota em C1, C2, C3, C4 e C5 e entenda o que sustentou — ou limitou — seu resultado.",
  },
  {
    number: "02",
    title: "Simulado com contexto de prova",
    text: "Treine um tema no formato do ENEM, escreva em até 30 linhas e controle o tempo de produção.",
  },
  {
    number: "03",
    title: "Próximo passo definido",
    text: "Use o diagnóstico, a média e o histórico para escolher o conteúdo mais importante antes da próxima redação.",
  },
];

export default function IntroLanding() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    page.classList.add("reveal-ready");
    const items = [...page.querySelectorAll<HTMLElement>(".intro-reveal")];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="intro-page refined-intro" ref={pageRef}>
      <AppHeader currentPath="/inicio" logoClickable={false} />

      <div className="intro-fold">
        <section className="intro-hero">
          <div className="intro-copy">
            <p className="intro-pill">
              <i /> PREPARAÇÃO PARA A REDAÇÃO DO ENEM
            </p>
            <h1>
              Treine com método. Chegue mais preparado ao <span>ENEM.</span>
            </h1>
            <p>
              Escreva, entenda seu desempenho nas cinco competências e saiba
              exatamente o que estudar antes do próximo texto.
            </p>
            <div className="intro-actions">
              <Link className="intro-primary" href="/inicio">
                Começar gratuitamente <b>→</b>
              </Link>
              <Link className="intro-secondary" href="#planos">
                Conheça nossos planos
              </Link>
            </div>
            <div
              className="intro-trust"
              aria-label="Recursos alinhados à redação do ENEM"
            >
              <span>
                <b>5 competências</b>
                <small>analisadas separadamente</small>
              </span>
              <span>
                <b>Até 30 linhas</b>
                <small>no padrão da prova</small>
              </span>
              <span>
                <b>Evolução visível</b>
                <small>em um único painel</small>
              </span>
            </div>
          </div>

          <div
            className="intro-visual"
            aria-label="Exemplo do painel de desempenho da redação"
          >
            <div className="visual-card">
              <div className="visual-card-head">
                <span>
                  <i /> PAINEL ENEM
                </span>
                <small>ÚLTIMAS 5 REDAÇÕES</small>
              </div>
              <div className="visual-score">
                <strong>826</strong>
                <span>/1000</span>
                <em>+38</em>
              </div>
              <p className="visual-label">Média atual</p>
              <div className="visual-bars">
                {[90, 86, 77, 83, 77].map((value, index) => (
                  <i key={index} style={{ height: `${value}%` }}>
                    <b>C{index + 1}</b>
                    <small>{[180, 172, 154, 166, 154][index]}</small>
                  </i>
                ))}
              </div>
              <div className="visual-target">
                <span>Meta atual</span>
                <b>900+</b>
                <progress value="826" max="1000" />
              </div>
            </div>
            <div className="visual-float">
              <i>↗</i>
              <span>
                <b>Você está evoluindo</b>
                <small>3 redações seguidas acima da média</small>
              </span>
            </div>
          </div>
        </section>

        <section
          className="intro-bottom"
          aria-label="Como funciona a plataforma"
        >
          <article>
            <span>01</span>
            <div>
              <h2>Escreva</h2>
              <p>Produza sua redação livre ou faça um simulado.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h2>Entenda</h2>
              <p>Veja o resultado por competência do ENEM.</p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h2>Evolua</h2>
              <p>Estude o ponto certo e acompanhe sua média.</p>
            </div>
          </article>
        </section>
      </div>

      <section className="intro-details" id="recursos">
        <div className="details-kicker" aria-hidden="true">
          <i />
        </div>
        <header className="intro-details-heading intro-reveal">
          <p>COMO A NOTA 1000 FUNCIONA</p>
          <h2>Um treino de redação que termina com uma decisão clara.</h2>
          <span>
            Você não recebe apenas uma nota. A plataforma organiza o resultado
            para mostrar onde melhorar e qual deve ser o foco do próximo treino.
          </span>
        </header>

        <div className="intro-feature-grid">
          {resources.map((resource, index) => (
            <article
              className="intro-feature intro-reveal"
              style={{ transitionDelay: `${index * 90}ms` }}
              key={resource.number}
            >
              <span>{resource.number}</span>
              <h3>{resource.title}</h3>
              <p>{resource.text}</p>
            </article>
          ))}
        </div>

        <section className="intro-study intro-reveal">
          <div className="study-copy">
            <p>ESTUDO DIRECIONADO</p>
            <h2>Do diagnóstico à prática seguinte.</h2>
            <span>
              Se sua maior dificuldade estiver na argumentação, por exemplo, a
              plataforma direciona você à Competência 3, à estrutura dos
              parágrafos e aos exercícios mais úteis para esse momento.
            </span>
          </div>
          <div className="study-flow">
            <span>
              <i>C3</i>
              <b>Diagnóstico</b>
              <small>Argumentação abaixo da média</small>
            </span>
            <em>→</em>
            <span>
              <i>02</i>
              <b>Aprendizado</b>
              <small>Progressão e repertório produtivo</small>
            </span>
            <em>→</em>
            <span>
              <i>+1</i>
              <b>Novo treino</b>
              <small>Aplicação em outra redação ENEM</small>
            </span>
          </div>
        </section>

        <section className="intro-plans intro-reveal" id="planos">
          <div className="intro-plan-copy">
            <p>PLANOS</p>
            <h2>Comece sem complicação.</h2>
            <span>
              A versão atual permite conhecer os recursos essenciais
              gratuitamente. O acompanhamento intensivo será lançado depois, com
              comunicação transparente antes de qualquer contratação.
            </span>
          </div>
          <article className="plan-current">
            <div>
              <small>ESSENCIAL</small>
              <b>Disponível agora</b>
            </div>
            <h3>Gratuito</h3>
            <ul>
              <li>Editor e simulado ENEM</li>
              <li>Trilha de aprendizagem</li>
              <li>Central de desempenho</li>
            </ul>
            <Link href="/inicio">Usar gratuitamente →</Link>
          </article>
          <article className="plan-soon">
            <div>
              <small>INTENSIVO</small>
              <b>EM DESENVOLVIMENTO</b>
            </div>
            <h3>Em breve</h3>
            <ul>
              <li>Mais correções e relatórios</li>
              <li>Metas personalizadas</li>
              <li>Acompanhamento aprofundado</li>
            </ul>
            <span>Sem cobrança nesta versão</span>
          </article>
        </section>
      </section>
    </main>
  );
}
