import { useState } from 'react'
import './pages.css'

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Fill all fields before sending your message.')
      return
    }

    if (!formData.email.includes('@')) {
      setErrorMessage('Enter a valid email address.')
      return
    }

    setSuccessMessage('Message sent successfully. Our team will contact you shortly.')
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <section className="form-card">
      <h2>Contact Us</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Full name" />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your message" rows="4" />
        <button type="submit">Send Message</button>
      </form>
    </section>
  )
}

export default Contact
