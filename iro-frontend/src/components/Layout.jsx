import Navbar from './Navbar'
import SubNavigation from './SubNavigation'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <SubNavigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
