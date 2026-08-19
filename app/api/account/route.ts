import { requireFirebaseUser } from "@/lib/firebase/auth-server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";

export async function DELETE(request: Request) {
  const user = await requireFirebaseUser(request);
  if (!user)
    return Response.json({ error: "Sessão inválida." }, { status: 401 });

  const db = getAdminDb();
  // Apaga primeiro os documentos privados e, por último, a identidade de autenticação.
  const essays = await db
    .collection("users")
    .doc(user.uid)
    .collection("essays")
    .get();
  const batch = db.batch();
  essays.docs.forEach((document) => batch.delete(document.ref));
  batch.delete(db.doc(`users/${user.uid}`));
  batch.delete(db.doc(`usage/${user.uid}`));
  await batch.commit();
  await getAdminAuth().deleteUser(user.uid);
  return Response.json({ ok: true });
}
