import { useEffect, useState } from 'react'
import { api } from '../api'
import './pages.css'

function OwnerRooms() {
  const [owner, setOwner] = useState(null)
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [roomName, setRoomName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      const data = await api.get('/api/owner/rooms/')
      setOwner(data.owner)
      setRooms(data.rooms)
      setBookings(data.bookings || [])
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

    if (!roomName.trim()) {
      setError('Room name is required')
      return
    }

    try {
      const data = await api.post('/api/owner/rooms/', { room_name: roomName.trim() })
      setMessage(data.message)
      setRoomName('')
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section className="page-card">
      <h2>Manage Rooms</h2>
      {owner && <p><strong>Owner:</strong> {owner.name}</p>}
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleSubmit} className="booking-form">
        <input value={roomName} onChange={(event) => setRoomName(event.target.value)} placeholder="Enter room name" />
        <button type="submit">Post room</button>
      </form>

      <h3>Your rooms</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Room Name</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 && (
            <tr>
              <td colSpan="2">No rooms posted yet.</td>
            </tr>
          )}
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Student bookings on your rooms</h3>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Student</th>
            <th>Room</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 && (
            <tr>
              <td colSpan="4">No student bookings yet.</td>
            </tr>
          )}
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.student_name}</td>
              <td>{booking.room_name}</td>
              <td>{booking.booking_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default OwnerRooms
