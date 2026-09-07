import { useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import PageRoutes from "./components/PageRoutes";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isApply = location.pathname.startsWith('/apply');
  const isStudent = location.pathname.startsWith('/students');

  if (isAdmin || isApply || isStudent) {
    return <PageRoutes />;
  }

  return (
    <Layout>
      <PageRoutes />
    </Layout>
  );
}
