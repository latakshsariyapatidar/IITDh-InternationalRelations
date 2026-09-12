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

  if (isAdmin || isApply || isStudent || isFaculty) {
    return <PageRoutes />;
  }

  return (
    <Layout>
      <PageRoutes />
    </Layout>
  );
}
