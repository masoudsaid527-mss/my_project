import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import About from './components/about'
import Home from './components/home'
import Login from './components/login'
import Register from './components/register'
import Dashboard from './components/dashboard'
import StudentBookings from './components/student-bookings'
import OwnerRooms from './components/owner-rooms'
import { api } from './api'
import './App.css'

function App() {
  const routerBase = import.meta.env.DEV ? '/' : '/app'
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await api.get('/api/me/')
        setUser(data)
      } catch {
        setUser(null)
      } finally {
        setLoadingUser(false)
      }
    }

    loadUser()
  }, [])

  if (loadingUser) {
    return (
      <div className="app-shell">
        <main className="app-main">
          <section className="page-card">
            <h2>Loading...</h2>
          </section>
        </main>
      </div>
    )
  }

  return (
    <BrowserRouter basename={routerBase}>
      <div className="app-shell">
        <header className="app-header">
          <h1>Hostel Management</h1>
          <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            {!user && <NavLink to="/login">Login</NavLink>}
            {!user && <NavLink to="/register">Register</NavLink>}
            {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          </nav>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={setUser} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />} />
            <Route path="/student/bookings" element={user?.role === 'student' ? <StudentBookings /> : <Navigate to="/dashboard" replace />} />
            <Route path="/owner/rooms" element={user?.role === 'hostel_owner' ? <OwnerRooms /> : <Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
