import SimuladoClient from "../SimuladoClient";
import ProtectedPage from "../ProtectedPage";

export default function SimuladoPage() {
  return (
    <ProtectedPage>
      <SimuladoClient />
    </ProtectedPage>
  );
}
