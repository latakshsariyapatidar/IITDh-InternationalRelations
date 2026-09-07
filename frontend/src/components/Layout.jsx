import Navbar from './Navbar'
import SubNavigation from './SubNavigation'
import Footer from './Footer'
import AnnouncementsMarquee from './AnnouncementsMarquee'

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-50 flex flex-col w-full shadow-md">
        <Navbar />
        <SubNavigation />
        <AnnouncementsMarquee />
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
