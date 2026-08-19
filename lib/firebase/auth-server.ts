import { getAdminAuth } from "./admin";

export async function requireFirebaseUser(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;

  try {
    return await getAdminAuth().verifyIdToken(header.slice(7), true);
  } catch {
    return null;
  }
}
