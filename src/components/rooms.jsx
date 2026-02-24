import { useMemo, useState } from 'react'
import './pages.css'

const roomInventory = [
  { id: 1, name: 'A-101', type: 'single', price: 120, available: true },
  { id: 2, name: 'A-102', type: 'double', price: 170, available: true },
  { id: 3, name: 'B-201', type: 'single', price: 140, available: false },
  { id: 4, name: 'B-205', type: 'double', price: 185, available: true },
  { id: 5, name: 'C-303', type: 'suite', price: 260, available: true },
]

function Rooms() {
  const [selectedType, setSelectedType] = useState('all')
  const [maxPrice, setMaxPrice] = useState(300)
  const [onlyAvailable, setOnlyAvailable] = useState(true)

  const filteredRooms = useMemo(() => {
    return roomInventory.filter((room) => {
      const typeMatch = selectedType === 'all' || room.type === selectedType
      const priceMatch = room.price <= maxPrice
      const availableMatch = !onlyAvailable || room.available
      return typeMatch && priceMatch && availableMatch
    })
  }, [selectedType, maxPrice, onlyAvailable])

  return (
    <section className="page-card">
      <h2>Available Rooms</h2>
      <div className="booking-form">
        <select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
          <option value="all">All types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
        </select>

        <label htmlFor="max-price">Max monthly price: ${maxPrice}</label>
        <input id="max-price" type="range" min="100" max="300" step="10" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />

        <label className="checkbox-row">
          <input type="checkbox" checked={onlyAvailable} onChange={(event) => setOnlyAvailable(event.target.checked)} />
          Show only available rooms
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th>Room</th>
            <th>Type</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.length === 0 && (
            <tr>
              <td colSpan="4">No rooms match your filters.</td>
            </tr>
          )}
          {filteredRooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.type}</td>
              <td>${room.price}</td>
              <td>{room.available ? 'Available' : 'Booked'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default Rooms
