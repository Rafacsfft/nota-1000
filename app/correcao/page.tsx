import DashboardClient from "../DashboardClient";
import ProtectedPage from "../ProtectedPage";

export default function CorrectionPage() {
  return (
    <ProtectedPage>
      <DashboardClient />
    </ProtectedPage>
  );
}
