import LearnClient from "../LearnClient";
import ProtectedPage from "../ProtectedPage";

export default function LearnPage() {
  return (
    <ProtectedPage>
      <LearnClient />
    </ProtectedPage>
  );
}
