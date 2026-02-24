import { useMemo, useState } from 'react'
import './pages.css'

const services = [
  { id: 'wifi', name: 'Fast WiFi', category: 'essentials', detail: 'Unlimited high-speed internet in all blocks.' },
  { id: 'security', name: '24/7 Security', category: 'safety', detail: 'CCTV and gate security around the clock.' },
  { id: 'laundry', name: 'Laundry', category: 'comfort', detail: 'Weekly laundry pickup and delivery service.' },
  { id: 'water', name: 'Water & Power', category: 'essentials', detail: 'Reliable backup systems for water and electricity.' },
  { id: 'cleaning', name: 'Room Cleaning', category: 'comfort', detail: 'Shared areas and rooms cleaned on schedule.' },
  { id: 'clinic', name: 'Clinic Access', category: 'safety', detail: 'Basic health support and emergency response.' },
]

function Services() {
  const [category, setCategory] = useState('all')

  const filteredServices = useMemo(() => {
    if (category === 'all') {
      return services
    }
    return services.filter((service) => service.category === category)
  }, [category])

  return (
    <section className="page-card">
      <h2>Hostel Services</h2>
      <p>Filter services by category.</p>

      <div className="chip-row">
        <button type="button" className={category === 'all' ? 'chip active-chip' : 'chip'} onClick={() => setCategory('all')}>All</button>
        <button type="button" className={category === 'essentials' ? 'chip active-chip' : 'chip'} onClick={() => setCategory('essentials')}>Essentials</button>
        <button type="button" className={category === 'comfort' ? 'chip active-chip' : 'chip'} onClick={() => setCategory('comfort')}>Comfort</button>
        <button type="button" className={category === 'safety' ? 'chip active-chip' : 'chip'} onClick={() => setCategory('safety')}>Safety</button>
      </div>

      <div className="values">
        {filteredServices.map((service) => (
          <article key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
