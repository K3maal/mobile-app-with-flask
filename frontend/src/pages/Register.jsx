import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/api.js'

function Register() {
  const navigate = useNavigate()

  // one variable for each field
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [rol, setRol] = useState('student')
  const [studentnummer, setStudentnummer] = useState('')
  const [error, setError] = useState('')

  async function handleRegister() {
    // send data to the backend
    const result = await registerUser(naam, email, wachtwoord, rol, studentnummer)

    if (result.error) {
      // show the error from the backend
      setError(result.error)
    } else {
      // account created — go to login page
      navigate('/')
    }
  }

  return (
    <div className="page-center">
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <h1 className="card-title">Create Account</h1>

        {/* Name */}
        <label className="form-label">Full Name</label>
        <input
          className="input"
          type="text"
          placeholder="Your name"
          value={naam}
          onChange={(e) => setNaam(e.target.value)}
        />

        {/* Email */}
        <label className="form-label">Email</label>
        <input
          className="input"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <label className="form-label">Password</label>
        <input
          className="input"
          type="password"
          placeholder="Choose a password"
          value={wachtwoord}
          onChange={(e) => setWachtwoord(e.target.value)}
        />

        {/* Role — student or teacher */}
        <label className="form-label">Role</label>
        <select
          className="input"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="docent">Teacher</option>
        </select>

        {/* Student number — only show when role is student */}
        {rol === 'student' && (
          <>
            <label className="form-label">Student Number</label>
            <input
              className="input"
              type="text"
              placeholder="Your student number"
              value={studentnummer}
              onChange={(e) => setStudentnummer(e.target.value)}
            />
          </>
        )}

        {/* Error message */}
        {error && <p className="error-msg">{error}</p>}

        {/* Submit button */}
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleRegister}>
          Create Account
        </button>

        {/* Link back to login */}
        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/" style={{ color: '#f97316' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
