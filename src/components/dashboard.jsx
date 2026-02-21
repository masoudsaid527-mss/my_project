import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import './pages.css'

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/api/logout/', {})
    } finally {
      onLogout()
      navigate('/login')
    }
  }

  return (
    <section className="page-card">
      <h2>Dashboard</h2>
      <p><strong>User:</strong> {user.username}</p>
      <p><strong>Role:</strong> {user.role || 'Not assigned'}</p>
      <div className="link-row">
        {user.role === 'student' && <button onClick={() => navigate('/student/bookings')}>Book Hostel</button>}
        {user.role === 'hostel_owner' && <button onClick={() => navigate('/owner/rooms')}>Manage Rooms</button>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </section>
  )
}

export default Dashboard
