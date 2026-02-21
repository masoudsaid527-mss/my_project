import { useEffect, useState } from 'react'
import { api } from '../api'
import './pages.css'

function StudentBookings() {
  const [student, setStudent] = useState(null)
  const [hostels, setHostels] = useState([])
  const [bookings, setBookings] = useState([])
  const [hostelId, setHostelId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      const data = await api.get('/api/student/bookings/')
      setStudent(data.student)
      setHostels(data.hostels)
      setBookings(data.bookings)
      if (data.hostels.length > 0) {
        setHostelId(String(data.hostels[0].id))
      }
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!hostelId) {
      setError('Please select a hostel room')
      return
    }

    try {
      const data = await api.post('/api/student/bookings/', { hostel_id: hostelId })
      setMessage(data.message)
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section className="page-card">
      <h2>Book Hostel Room</h2>
      {student && <p><strong>Student:</strong> {student.name}</p>}
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleSubmit} className="booking-form">
        <select value={hostelId} onChange={(event) => setHostelId(event.target.value)}>
          {hostels.map((hostel) => (
            <option key={hostel.id} value={hostel.id}>
              {hostel.name} (Owner: {hostel.owner_name})
            </option>
          ))}
        </select>
        <button type="submit">Book now</button>
      </form>

      <h3>Your bookings</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Room</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 && (
            <tr>
              <td colSpan="3">No bookings yet.</td>
            </tr>
          )}
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.room_name}</td>
              <td>{booking.booking_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default StudentBookings
