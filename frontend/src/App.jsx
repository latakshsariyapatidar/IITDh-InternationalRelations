import { useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import PageRoutes from "./components/PageRoutes";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isApply = 
    location.pathname.startsWith('/international-admissions/apply') ||
    location.pathname.startsWith('/international-mobility/apply') ||
    location.pathname.startsWith('/apply') ||
    location.pathname.startsWith('/inbound-exchange/apply');
  const isStudent = location.pathname.startsWith('/students');
  const isFaculty = location.pathname.startsWith('/faculty-portal');
  // Standalone page — no navbar/footer. URL is not linked anywhere on the
  // public site; it is shared directly with visiting delegates.
  const isDelegateForm = location.pathname.startsWith('/iro/delegate-registration');

  if (isAdmin || isApply || isStudent || isFaculty || isDelegateForm) {
    return <PageRoutes />;
  }

  return (
    <Layout>
      <PageRoutes />
    </Layout>
  );
}
