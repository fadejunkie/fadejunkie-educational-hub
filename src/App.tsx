import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Lander from './pages/Lander'
import EducationHub from './pages/EducationHub'
import Flash from './pages/Flash'
import Quiz from './pages/Quiz'
import Room from './pages/Room'
import Partners from './pages/Partners'
import Barber from './pages/Barber'
import Profile from './pages/Profile'
import AccountSettings from './pages/AccountSettings'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-white)' }}>
      <Nav />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Lander />} />
          <Route path="/education" element={<EducationHub />} />
          <Route path="/education/flash" element={<Flash />} />
          <Route path="/education/quiz" element={<Quiz />} />
          <Route path="/education/room" element={<Room />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/barber" element={<Barber />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/account" element={<AccountSettings />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
