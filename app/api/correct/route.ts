import { FieldValue } from "firebase-admin/firestore";
import { requireFirebaseUser } from "@/lib/firebase/auth-server";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

type Body = {
  theme?: string;
  text?: string;
  fileData?: string;
  fileType?: string;
  fileName?: string;
};
type Result = {
  total: number;
  competencies: { code: string; score: number; feedback: string }[];
  summary: string;
  strengths: string[];
  priorities: string[];
};
type ApiResponse = {
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  error?: { message?: string };
};

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["total", "competencies", "summary", "strengths", "priorities"],
  properties: {
    total: { type: "integer", minimum: 0, maximum: 1000 },
    competencies: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["code", "score", "feedback"],
        properties: {
          code: { type: "string", enum: ["C1", "C2", "C3", "C4", "C5"] },
          score: { type: "integer", minimum: 0, maximum: 200 },
          feedback: { type: "string" },
        },
      },
    },
    summary: { type: "string" },
    strengths: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 4,
    },
    priorities: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 4,
    },
  },
};

const MAX_BODY_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
  const declaredSize = Number(request.headers.get("content-length") ?? 0);
  if (declaredSize > MAX_BODY_BYTES)
    return Response.json(
      { error: "O envio ultrapassa o limite permitido." },
      { status: 413 },
    );

  // Toda correção exige um token Firebase válido; nunca confiamos em um ID enviado pelo navegador.
  const user = await requireFirebaseUser(request);
  if (!user)
    return Response.json(
      { error: "Entre na sua conta para corrigir a redação." },
      { status: 401 },
    );

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    return Response.json(
      {
        error:
          "A correção por IA ainda não foi configurada pelo administrador.",
      },
      { status: 503 },
    );

  let body: Body;
  // A transação evita que pedidos simultâneos ultrapassem a franquia mensal.
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Envio inválido." }, { status: 400 });
  }
  if (!body.text && !body.fileData)
    return Response.json(
      { error: "Adicione o texto ou um arquivo da redação." },
      { status: 400 },
    );
  if (body.text && (body.text.length < 80 || body.text.length > 15000))
    return Response.json(
      { error: "A redação deve ter entre 80 e 15.000 caracteres." },
      { status: 400 },
    );
  if (
    body.fileType &&
    !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(
      body.fileType,
    )
  )
    return Response.json(
      { error: "Formato de arquivo não permitido." },
      { status: 400 },
    );

  const db = getAdminDb();
  const period = new Date().toISOString().slice(0, 7);
  const monthlyLimit = Math.max(
    1,
    Number(process.env.MONTHLY_CORRECTION_LIMIT) || 5,
  );
  const usageRef = db.doc(`usage/${user.uid}`);

  try {
    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(usageRef);
      const data = snapshot.data();
      const currentCount =
        data?.period === period ? Number(data.count ?? 0) : 0;
      if (currentCount >= monthlyLimit) throw new Error("LIMIT_REACHED");
      transaction.set(
        usageRef,
        {
          period,
          count: currentCount + 1,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    });
  } catch (error) {
    if (error instanceof Error && error.message === "LIMIT_REACHED")
      return Response.json(
        {
          error: `Você atingiu o limite de ${monthlyLimit} correções deste mês.`,
        },
        { status: 429 },
      );
    return Response.json(
      { error: "Não foi possível validar seu limite de correções." },
      { status: 503 },
    );
  }

  try {
    const content: Array<Record<string, unknown>> = [
      {
        type: "input_text",
        text: `Tema informado: ${body.theme || "não informado"}. Corrija a redação anexada ou transcrita segundo as cinco competências oficiais do ENEM. Seja rigoroso, pedagógico e específico. Não invente trechos. A soma das cinco notas deve ser exatamente o total. Texto: ${body.text || "A redação está no arquivo anexado."}`,
      },
    ];
    if (body.fileData) {
      if (body.fileType === "application/pdf")
        content.unshift({
          type: "input_file",
          filename: body.fileName || "redacao.pdf",
          file_data: body.fileData,
        });
      else
        content.unshift({
          type: "input_image",
          image_url: body.fileData,
          detail: "high",
        });
    }

    // A chave fica apenas no servidor. O navegador recebe somente o resultado estruturado.
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5.6-luna",
        instructions:
          "Você é um corretor especializado em redação ENEM. Avalie C1 norma padrão, C2 compreensão do tema e repertório, C3 seleção e organização dos argumentos, C4 coesão, e C5 proposta de intervenção respeitando os direitos humanos. Responda exclusivamente no JSON solicitado.",
        input: [{ role: "user", content }],
        text: {
          format: {
            type: "json_schema",
            name: "enem_correction",
            strict: true,
            schema,
          },
        },
      }),
    });
    const data = (await response.json()) as ApiResponse;
    if (!response.ok)
      throw new Error(
        data.error?.message ||
          "O serviço de correção não conseguiu processar o texto.",
      );
    const outputText = data.output
      ?.flatMap((item) => item.content || [])
      .find((item) => item.type === "output_text")?.text;
    if (!outputText) throw new Error("A correção retornou vazia.");

    const result = JSON.parse(outputText) as Result;
    const essayRef = db
      .collection("users")
      .doc(user.uid)
      .collection("essays")
      .doc();
    await essayRef.set({
      ...result,
      theme: body.theme?.trim() || "Redação ENEM",
      inputType: body.fileData ? "file" : "text",
      fileName: body.fileName || null,
      // Por padrão, o texto integral não é persistido; apenas nota e feedback entram no histórico.
      ...(process.env.STORE_ESSAY_TEXT === "true" && body.text
        ? { text: body.text }
        : {}),
      createdAt: FieldValue.serverTimestamp(),
    });
    return Response.json({ ...result, id: essayRef.id });
  } catch (error) {
    await usageRef
      .set(
        {
          count: FieldValue.increment(-1),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      )
      .catch(() => undefined);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Não foi possível corrigir a redação.",
      },
      { status: 502 },
    );
  }
}
