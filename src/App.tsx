import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Lander from './pages/Lander'
import EducationHub from './pages/EducationHub'
import Partners from './pages/Partners'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-white)' }}>
      <Nav />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Lander />} />
          <Route path="/education/*" element={<EducationHub />} />
          <Route path="/partners" element={<Partners />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
