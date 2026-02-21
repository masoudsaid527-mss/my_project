import { Link } from 'react-router-dom'
import './pages.css'

function Home() {
  return (
    <section className="page-card">
      <h2>Welcome to Hostel Management System</h2>
      <p>Use the links below to get started.</p>
      <div className="link-row">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/about">About</Link>
      </div>
    </section>
  )
}

export default Home
