"use client";

import { useEffect, useMemo, useState } from "react";
import AppHeader from "./AppHeader";
import { useAuth } from "./AuthProvider";

type IconName =
  | "home"
  | "pen"
  | "history"
  | "chart"
  | "book"
  | "help"
  | "bell"
  | "spark"
  | "arrow"
  | "upload"
  | "text"
  | "check"
  | "clock"
  | "target"
  | "close"
  | "user"
  | "lock"
  | "rotate"
  | "play"
  | "pause"
  | "reset"
  | "trophy";
function Icon({ name }: { name: IconName }) {
  const p: Record<IconName, React.ReactNode> = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5M9 21v-7h6v7" />
      </>
    ),
    pen: (
      <>
        <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
        <path d="m14.5 7.5 3 3" />
      </>
    ),
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5M12 7v5l3 2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23V5.5Z" />
        <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23V5.5Z" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.4 2.4 0 1 1 3.2 2.3c-.8.3-1 1-1 1.7M12 17h.01" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.3 4.2L17 9l-3.7 1.8L12 15l-1.3-4.2L7 9l3.7-1.8L12 3Z" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M14 7l5 5-5 5" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4M7 9l5-5 5 5" />
        <path d="M4 15v5h16v-5" />
      </>
    ),
    text: (
      <>
        <path d="M5 5h14M12 5v14M8 19h8" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12M18 6 6 18" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    rotate: (
      <>
        <path d="M20 7v5h-5" />
        <path d="M19 12a7 7 0 1 1-2-5" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7V5Z" />,
    pause: (
      <>
        <path d="M8 5v14M16 5v14" />
      </>
    ),
    reset: (
      <>
        <path d="M4 4v6h6" />
        <path d="M5.5 15a7 7 0 1 0 .4-7" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM9 20h6M12 13v7M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4" />
      </>
    ),
  };
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {p[name]}
    </svg>
  );
}

type Panel =
  "login" | "streak" | "progress" | "help" | "profile" | "result" | null;
type Result = {
  total: number;
  competencies: { code: string; score: number; feedback: string }[];
  summary: string;
  strengths: string[];
  priorities: string[];
};
const skills = [
  { code: "C1", label: "Norma culta", score: 180 },
  { code: "C2", label: "Compreensão", score: 172 },
  { code: "C3", label: "Argumentação", score: 154 },
  { code: "C4", label: "Coesão", score: 166 },
  { code: "C5", label: "Intervenção", score: 154 },
];

export default function DashboardClient() {
  const { user, displayName, logout } = useAuth();
  const [mode, setMode] = useState<"text" | "file">("text"),
    [essay, setEssay] = useState(""),
    [theme, setTheme] = useState(""),
    [panel, setPanel] = useState<Panel>(null),
    [notice, setNotice] = useState("");
  const [timerOn, setTimerOn] = useState(false),
    [running, setRunning] = useState(false),
    [seconds, setSeconds] = useState(5400);
  const [fileName, setFileName] = useState(""),
    [fileType, setFileType] = useState(""),
    [fileData, setFileData] = useState(""),
    [dragging, setDragging] = useState(false),
    [rotation, setRotation] = useState(0),
    [zoom, setZoom] = useState(1),
    [fileError, setFileError] = useState("");
  const [analyzing, setAnalyzing] = useState(false),
    [result, setResult] = useState<Result | null>(null),
    [nickname, setNickname] = useState("");
  const lines = useMemo(() => (essay ? essay.split("\n").length : 0), [essay]),
    words = useMemo(
      () => (essay.trim() ? essay.trim().split(/\s+/).length : 0),
      [essay],
    );
  const canStart =
    mode === "text" ? essay.trim().length >= 80 : Boolean(fileData);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () =>
        setSeconds((s) => {
          if (s <= 1) {
            setRunning(false);
            setNotice("Tempo encerrado. Revise sua conclusão.");
            return 0;
          }
          return s - 1;
        }),
      1000,
    );
    return () => window.clearInterval(id);
  }, [running]);
  const show = (m: string) => {
      setNotice(m);
      window.setTimeout(() => setNotice(""), 3500);
    },
    go = (id: string) => {
      if (id === "inicio") {
        window.location.href = "/";
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
  const changeEssay = (value: string) => {
    if (value.split("\n").length <= 30) setEssay(value);
    else show("Limite de 30 linhas atingido.");
  };
  const chooseFile = (file?: File) => {
    setFileError("");
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setFileError("O arquivo deve ter no máximo 10 MB.");
      return;
    }
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setFileError("Envie JPG, PNG ou PDF.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFileName(file.name);
      setFileType(file.type);
      setFileData(String(reader.result));
      setRotation(0);
      setZoom(1);
    };
    reader.readAsDataURL(file);
  };
  const preparedImage = async () => {
    if (!fileType.startsWith("image/") || !fileData) return fileData;
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 1600;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 1200, 1600);
        ctx.translate(600, 800);
        ctx.rotate((rotation * Math.PI) / 180);
        const swapped = rotation % 180 !== 0,
          iw = swapped ? img.height : img.width,
          ih = swapped ? img.width : img.height,
          scale = Math.max(1200 / iw, 1600 / ih) * zoom;
        ctx.drawImage(
          img,
          (-img.width * scale) / 2,
          (-img.height * scale) / 2,
          img.width * scale,
          img.height * scale,
        );
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = fileData;
    });
  };
  const start = async () => {
    if (!canStart) return;
    if (!user) {
      setPanel("login");
      return;
    }
    setAnalyzing(true);
    try {
      const token = await user.getIdToken();
      const payload = {
        theme,
        text: mode === "text" ? essay : undefined,
        fileData: mode === "file" ? await preparedImage() : undefined,
        fileType: mode === "file" ? fileType : undefined,
        fileName: mode === "file" ? fileName : undefined,
      };
      const res = await fetch("/api/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 401) {
        setPanel("login");
        return;
      }
      if (!res.ok)
        throw new Error(data.error || "Não foi possível corrigir agora.");
      setResult(data);
      setPanel("result");
    } catch (e) {
      show(e instanceof Error ? e.message : "Erro ao corrigir a redação.");
    } finally {
      setAnalyzing(false);
    }
  };
  const time = `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <main className="app-shell advanced correction-only">
      <AppHeader currentPath="/correcao" />
      <section className="main-area" id="inicio">
        <div className="content">
          <section className="welcome">
            <div>
              <p className="kicker">PREPARAÇÃO PARA O ENEM</p>
              <h1>
                {`Olá, ${displayName.split(" ")[0]}`} <span>✦</span>
              </h1>
              <p>
                Treine nas condições do ENEM e transforme cada versão em
                progresso.
              </p>
            </div>
            <button className="goal-card" onClick={() => setPanel("progress")}>
              <Icon name="target" />
              <span>
                <small>META ATUAL</small>
                <b>900+ pontos</b>
                <em>Faltam 74 pontos</em>
              </span>
              <i>
                <b>826</b>/1000
              </i>
            </button>
          </section>
          <section className="correction-card advanced-editor" id="nova">
            <div className="card-heading">
              <div className="ai-badge">
                <Icon name="spark" />
              </div>
              <div>
                <h2>Nova redação</h2>
                <p>Editor avançado com padrão de 30 linhas do ENEM.</p>
              </div>
              <button
                className={"simulation-toggle " + (timerOn ? "on" : "")}
                onClick={() => {
                  setTimerOn((v) => !v);
                  setRunning(false);
                }}
              >
                <Icon name="clock" /> Modo Simulado
              </button>
            </div>
            {timerOn && (
              <div className="timer-bar">
                <span>
                  <small>TEMPO RESTANTE</small>
                  <b>{time}</b>
                </span>
                <div>
                  <button
                    onClick={() => setRunning((v) => !v)}
                    aria-label={running ? "Pausar" : "Iniciar"}
                  >
                    <Icon name={running ? "pause" : "play"} />
                    {running ? "Pausar" : "Iniciar"}
                  </button>
                  <button
                    onClick={() => {
                      setRunning(false);
                      setSeconds(5400);
                    }}
                  >
                    <Icon name="reset" />
                    Reiniciar
                  </button>
                </div>
                <progress value={5400 - seconds} max="5400" />
              </div>
            )}
            <div className="mode-tabs">
              <button
                className={mode === "text" ? "active" : ""}
                onClick={() => setMode("text")}
              >
                <Icon name="text" /> Digitar ou colar
              </button>
              <button
                className={mode === "file" ? "active" : ""}
                onClick={() => setMode("file")}
              >
                <Icon name="upload" /> Foto ou PDF
              </button>
            </div>
            <label className="theme-label" htmlFor="theme">
              Tema da redação <span>opcional</span>
            </label>
            <input
              id="theme"
              className="theme-input gold-focus"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex.: Desafios para a valorização da ciência no Brasil"
            />
            {mode === "text" ? (
              <div className="line-editor gold-focus">
                <div className="line-numbers" aria-hidden="true">
                  {Array.from({ length: 30 }, (_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <textarea
                  value={essay}
                  onChange={(e) => changeEssay(e.target.value)}
                  placeholder="Escreva sua redação. Use Enter para avançar uma linha..."
                />
                <footer>
                  <span className={lines >= 30 ? "limit" : ""}>
                    {lines}/30 linhas
                  </span>
                  <span>{words} palavras</span>
                  <small>Ctrl + Enter para corrigir</small>
                </footer>
              </div>
            ) : (
              <div className="upload-workspace">
                <label
                  className={
                    "smart-dropzone " +
                    (dragging ? "dragging" : "") +
                    (fileData ? " has-file" : "")
                  }
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    chooseFile(e.dataTransfer.files[0]);
                  }}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => chooseFile(e.target.files?.[0])}
                  />
                  {!fileData ? (
                    <>
                      <i>
                        <Icon name="upload" />
                      </i>
                      <b>Arraste sua redação até aqui</b>
                      <p>ou clique para selecionar · JPG, PNG ou PDF</p>
                    </>
                  ) : fileType.startsWith("image/") ? (
                    <div className="image-crop-frame">
                      {/* A URL é local (data URL) e precisa preservar rotação/zoom antes do envio. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fileData}
                        alt="Prévia da redação"
                        style={{
                          transform: `rotate(${rotation}deg) scale(${zoom})`,
                        }}
                      />
                      <span>Área que será enviada para leitura</span>
                    </div>
                  ) : (
                    <div className="pdf-preview">
                      <Icon name="text" />
                      <b>{fileName}</b>
                      <small>PDF pronto para leitura</small>
                    </div>
                  )}
                </label>
                {fileData && (
                  <div className="crop-tools">
                    <button
                      onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                    >
                      <Icon name="rotate" /> Esquerda
                    </button>
                    <button onClick={() => setRotation((r) => (r + 90) % 360)}>
                      <Icon name="rotate" /> Direita
                    </button>
                    {fileType.startsWith("image/") && (
                      <label>
                        Enquadramento{" "}
                        <input
                          type="range"
                          min="1"
                          max="2"
                          step=".05"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                        />
                      </label>
                    )}
                    <button
                      onClick={() => {
                        setFileData("");
                        setFileName("");
                      }}
                    >
                      Trocar arquivo
                    </button>
                  </div>
                )}
                {fileError && <p className="field-error">{fileError}</p>}
              </div>
            )}
            <div className="card-footer">
              <p>
                <Icon name="lock" /> Correção privada e vinculada à sua conta.
              </p>
              <button
                className="start-button"
                disabled={!canStart || analyzing}
                onClick={start}
              >
                {analyzing ? "Analisando com IA..." : "Corrigir minha redação"}
                <Icon name="arrow" />
              </button>
            </div>
          </section>
        </div>
      </section>
      {panel && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPanel(null);
          }}
        >
          <section className="modal" role="dialog" aria-modal="true">
            <button
              className="modal-close"
              aria-label="Fechar"
              onClick={() => setPanel(null)}
            >
              <Icon name="close" />
            </button>
            {panel === "login" && (
              <>
                <div className="modal-icon">
                  <Icon name="user" />
                </div>
                <p className="modal-kicker">SALVE SEU PROGRESSO</p>
                <h2>Entre para corrigir sua redação</h2>
                <p className="modal-copy">
                  Use seu e-mail ou sua conta Google. Sua identidade protege
                  suas correções e seu histórico.
                </p>
                <label className="nickname-field">
                  Nome ou apelido{" "}
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Como você quer ser chamado?"
                  />
                </label>
                <a
                  className="account-button"
                  href="/login?return_to=%2Fcorrecao"
                >
                  <Icon name="spark" /> Entrar ou criar conta
                </a>
              </>
            )}
            {panel === "streak" && (
              <>
                <p className="modal-kicker">7 DIAS DE OFENSIVA</p>
                <h2>Você está construindo consistência</h2>
                <div className="achievement">
                  <Icon name="trophy" />
                  <span>
                    <b>Meta diária concluída</b>
                    <small>1 redação revisada · +25 XP</small>
                  </span>
                </div>
                <div className="reward-track">
                  <span>
                    <b>50 XP</b>
                    <small>Hoje</small>
                  </span>
                  <span className="active">
                    <b>100 XP</b>
                    <small>7 dias</small>
                  </span>
                  <span>
                    <b>200 XP</b>
                    <small>14 dias</small>
                  </span>
                </div>
                <button
                  className="primary-wide"
                  onClick={() => {
                    setPanel(null);
                    go("nova");
                  }}
                >
                  Continuar ofensiva <Icon name="arrow" />
                </button>
              </>
            )}
            {panel === "progress" && (
              <>
                <p className="modal-kicker">META 900+</p>
                <h2>Faltam 74 pontos para sua meta</h2>
                <p className="modal-copy">
                  Priorize C3 e C5: são as competências com maior espaço para
                  evolução.
                </p>
                <div className="full-competence">
                  {skills.map((s) => (
                    <div key={s.code}>
                      <span>
                        <i>{s.code}</i>
                        {s.label}
                        <b>{s.score}/200</b>
                      </span>
                      <progress value={s.score} max="200" />
                    </div>
                  ))}
                </div>
                <button
                  className="primary-wide"
                  onClick={() => {
                    setPanel(null);
                    go("nova");
                  }}
                >
                  Treinar agora <Icon name="arrow" />
                </button>
              </>
            )}
            {panel === "help" && (
              <>
                <p className="modal-kicker">COMO FUNCIONA</p>
                <h2>Da primeira linha ao plano de melhoria</h2>
                <div className="steps">
                  <div>
                    <b>1</b>
                    <span>
                      <strong>Escreva ou fotografe</strong>
                      <small>
                        Use o editor de 30 linhas ou envie sua folha.
                      </small>
                    </span>
                  </div>
                  <div>
                    <b>2</b>
                    <span>
                      <strong>Entre com segurança</strong>
                      <small>Sua conta protege o histórico.</small>
                    </span>
                  </div>
                  <div>
                    <b>3</b>
                    <span>
                      <strong>Receba a correção</strong>
                      <small>A IA avalia as cinco competências do ENEM.</small>
                    </span>
                  </div>
                </div>
              </>
            )}
            {panel === "profile" && user && (
              <>
                <div className="profile-large">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
                <h2>{nickname || displayName}</h2>
                <p className="modal-copy centered">{user.email}</p>
                <button
                  className="secondary-link"
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                >
                  Sair da conta
                </button>
              </>
            )}
            {panel === "result" && result && (
              <>
                <p className="modal-kicker">CORREÇÃO COM IA</p>
                <h2>{theme || "Sua redação"}</h2>
                <div className="result-score">
                  <span className="great">{result.total}</span>
                  <small>/1000 pontos</small>
                </div>
                <div className="mini-scores">
                  {result.competencies.map((c) => (
                    <span key={c.code}>
                      {c.code}
                      <b>{c.score}</b>
                    </span>
                  ))}
                </div>
                <div className="feedback-box">
                  <b>Resumo da correção</b>
                  <p>{result.summary}</p>
                </div>
                <div className="result-columns">
                  <div>
                    <b>Pontos fortes</b>
                    {result.strengths.map((x) => (
                      <p key={x}>✓ {x}</p>
                    ))}
                  </div>
                  <div>
                    <b>Próximos passos</b>
                    {result.priorities.map((x) => (
                      <p key={x}>→ {x}</p>
                    ))}
                  </div>
                </div>
                <button
                  className="primary-wide"
                  onClick={() => {
                    setPanel(null);
                    go("nova");
                  }}
                >
                  Reescrever redação <Icon name="arrow" />
                </button>
              </>
            )}
          </section>
        </div>
      )}
      {notice && (
        <div className="toast" role="status">
          <Icon name="check" />
          <span>{notice}</span>
        </div>
      )}
    </main>
  );
}
