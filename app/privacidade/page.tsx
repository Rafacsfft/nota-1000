import Link from "next/link";
import AppHeader from "../AppHeader";

export const metadata = {
  title: "Política de Privacidade — Nota 1000",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const support =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "contato@nota1000.com.br";
  return (
    <main className="legal-page">
      <AppHeader currentPath="/privacidade" />
      <article>
        <p className="portal-eyebrow">PRIVACIDADE</p>
        <h1>Política de Privacidade</h1>
        <p className="legal-updated">Versão de 19 de agosto de 2026</p>
        <p>
          A Nota 1000 utiliza apenas os dados necessários para autenticar
          usuários, corrigir redações, salvar resultados e apresentar a evolução
          nas cinco competências do ENEM.
        </p>
        <h2>Dados tratados</h2>
        <p>
          Podemos tratar nome, apelido, e-mail, identificador da conta, redações
          digitadas, arquivos enviados temporariamente, notas, feedbacks, metas
          e dados técnicos de segurança.
        </p>
        <h2>Finalidades</h2>
        <p>
          Os dados são usados para fornecer a plataforma, proteger contas,
          processar correções, manter o histórico, prevenir abuso, cumprir
          obrigações legais e melhorar a segurança do serviço.
        </p>
        <h2>Fornecedores</h2>
        <p>
          Autenticação, hospedagem, banco e armazenamento podem ser operados
          pelo Google Firebase. O conteúdo da redação pode ser enviado a um
          fornecedor de inteligência artificial para produzir a correção. Esses
          fornecedores tratam dados conforme seus próprios contratos e
          políticas.
        </p>
        <h2>Arquivos e retenção</h2>
        <p>
          Imagens e PDFs são processados para leitura da redação e não são
          salvos no histórico por padrão. Resultados permanecem vinculados à
          conta até que o usuário os exclua ou solicite a exclusão da conta.
        </p>
        <h2>Crianças e adolescentes</h2>
        <p>
          O serviço deve observar o melhor interesse de crianças e adolescentes.
          Usuários menores devem utilizar a plataforma com conhecimento de seus
          responsáveis. Não vendemos dados pessoais nem usamos redações para
          publicidade comportamental.
        </p>
        <h2>Direitos do titular</h2>
        <p>
          O usuário pode acessar, corrigir ou excluir sua conta e seus dados.
          Solicitações adicionais podem ser enviadas para{" "}
          <a href={`mailto:${support}`}>{support}</a>.
        </p>
        <h2>Segurança</h2>
        <p>
          Aplicamos autenticação, controles de acesso e armazenamento protegido
          de segredos. Nenhum sistema é absolutamente imune a falhas; incidentes
          relevantes serão tratados conforme a legislação aplicável.
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
