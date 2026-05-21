import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Life from './pages/Life'
import Contact from './pages/Contact'
import Collaboration from './pages/Collaboration'
import Admission from './pages/Admission'
import Partners from './pages/Partners'
import Visits from './pages/Visits'
import Visa from './pages/Visa'
import Gallery from './pages/Gallery'
import Downloads from './pages/Downloads'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/life" element={<Life />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/collaboration" element={<Collaboration />} />
        <Route path="/admission" element={<Admission />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/visits" element={<Visits />} />
        <Route path="/visa" element={<Visa />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/downloads" element={<Downloads />} />
      </Routes>
    </Layout>
  )
}
