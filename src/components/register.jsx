import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import './pages.css'

function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    role: '',
    password: '',
    confirmPassword: '',
    address: '',
    age: '',
    duration: '',
    gender: '',
    phone: '',
    location: '',
  })

  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }

  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }
    if (!formData.role) {
      newErrors.role = 'Please select a role'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await api.post('/api/register/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        username: formData.username,
        role: formData.role,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        address: formData.address,
        age: formData.age,
        duration: formData.duration,
        gender: formData.gender,
        phone: formData.phone,
        location: formData.location,
      })

      setSuccess('Registration successful. Redirecting to login...')
      setTimeout(() => navigate('/login'), 600)
    } catch (requestError) {
      const apiErrors = requestError?.data?.errors
      if (apiErrors && typeof apiErrors === 'object') {
        setErrors((prev) => ({ ...prev, ...apiErrors }))
      }
      setError(requestError.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="form-card">
      <h2>Create an Account</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className={errors.firstName ? 'input-error' : ''} />
          {errors.firstName && <span className="field-error">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className={errors.lastName ? 'input-error' : ''} />
          {errors.lastName && <span className="field-error">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className={errors.email ? 'input-error' : ''} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} className={errors.username ? 'input-error' : ''} />
          {errors.username && <span className="field-error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <select name="role" value={formData.role} onChange={handleInputChange} className={errors.role ? 'input-error' : ''}>
            <option value="">-- Register as --</option>
            <option value="student">Student</option>
            <option value="hostel_owner">Hostel Owner</option>
          </select>
          {errors.role && <span className="field-error">{errors.role}</span>}
        </div>

        <div className="form-group">
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} />
        </div>

        {formData.role === 'student' && (
          <>
            <div className="form-group">
              <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} min="1" />
            </div>
            <div className="form-group">
              <input type="number" name="duration" placeholder="Duration (months)" value={formData.duration} onChange={handleInputChange} min="1" />
            </div>
            <div className="form-group">
              <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleInputChange} />
            </div>
          </>
        )}

        {formData.role === 'hostel_owner' && (
          <>
            <div className="form-group">
              <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} />
            </div>
          </>
        )}

        <div className="form-group">
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className={errors.password ? 'input-error' : ''} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} className={errors.confirmPassword ? 'input-error' : ''} />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </section>
  )
}

export default Register
