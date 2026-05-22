import Layout from "./components/Layout";
import SmoothScrollWrapper from "./components/SmoothScrollWrapper";
import PageRoutes from "./components/PageRoutes";
import 'locomotive-scroll/dist/locomotive-scroll.css';

export default function App() {
  return (
    <Layout>
      <SmoothScrollWrapper>
        <PageRoutes />
      </SmoothScrollWrapper>
    </Layout>
  );
}
