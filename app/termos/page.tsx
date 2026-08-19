import Link from "next/link";
import AppHeader from "../AppHeader";

export const metadata = {
  title: "Termos de Uso — Nota 1000",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  const support =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "contato@nota1000.com.br";
  return (
    <main className="legal-page">
      <AppHeader currentPath="/termos" />
      <article>
        <p className="portal-eyebrow">TERMOS</p>
        <h1>Termos de Uso</h1>
        <p className="legal-updated">Versão de 19 de agosto de 2026</p>
        <h2>Finalidade educacional</h2>
        <p>
          A Nota 1000 é uma ferramenta de treino para redações no formato do
          ENEM. Ela não representa o INEP, o Ministério da Educação ou qualquer
          banca oficial.
        </p>
        <h2>Correções automatizadas</h2>
        <p>
          Notas e feedbacks produzidos por inteligência artificial são
          estimativas educacionais. Eles podem conter imprecisões e não
          substituem a avaliação de professores ou corretores oficiais.
        </p>
        <h2>Conta</h2>
        <p>
          O usuário deve fornecer informações verdadeiras, proteger sua conta e
          não compartilhar o acesso. Contas utilizadas para fraude, automação
          abusiva ou violação de terceiros poderão ser limitadas.
        </p>
        <h2>Uso permitido</h2>
        <p>
          É permitido usar a plataforma para estudo pessoal. Não é permitido
          tentar acessar contas de terceiros, contornar limites, sobrecarregar o
          serviço, enviar conteúdo ilegal ou explorar vulnerabilidades.
        </p>
        <h2>Limites e disponibilidade</h2>
        <p>
          A quantidade de correções pode ser limitada para controlar custos e
          manter o serviço disponível. Recursos podem mudar durante a fase beta,
          com comunicação adequada aos usuários.
        </p>
        <h2>Propriedade do conteúdo</h2>
        <p>
          O usuário continua responsável pelo texto que envia. Ao usar a
          correção, autoriza o processamento técnico necessário para gerar e
          salvar o resultado solicitado.
        </p>
        <h2>Exclusão</h2>
        <p>
          A conta e o histórico podem ser excluídos pelo perfil. Dúvidas podem
          ser enviadas para <a href={`mailto:${support}`}>{support}</a>.
        </p>
        <p className="legal-note">
          Este texto é uma base técnica e deve ser revisado por um responsável e
          por orientação jurídica antes do lançamento público.
        </p>
        <Link href="/">Voltar para a Nota 1000</Link>
      </article>
    </main>
  );
}
