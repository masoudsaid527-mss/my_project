import { Link } from 'react-router-dom'
import './pages.css'

function Home({ user }) {
  return (
    <section className="page-card">
      <h2>Welcome to Hostel Management System</h2>
      <p>Simple hostel workflow based on your role.</p>
      <div className="link-row">
        {user && <Link to="/dashboard">Dashboard</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
      </div>
    </section>
  )
}

export default Home
