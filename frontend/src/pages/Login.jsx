import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

function Login(){
  const[email, setEmail] = useState('')
  const[wachtwoord, setWachtwoord] = useState('')
  const[error, setError] = useState('')

  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleLogin(){
    const result = await loginUser (email, wachtwoord)

    if (result.error){
      setError(result.error)
    }else{
      login(result)
      if (result.rol === 'student') {
        navigate('/student')
      }else{
        navigate('/teacher')
      }
    }
  }
return(
  <div className="page-center">
    <div className="card" style={{width: '100%', maxWidth: '400px'}}>
      <h1 className="card-title">Login</h1>

      <input
      className="input"
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      />

      <input
      className="input"
      type="password"
      placeholder="Password"
      value={wachtwoord}
      onChange={(e) => setWachtwoord(e.target.value)}
      />

      {error && <p className="error-msg">{error}</p>}

      <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleLogin}>Login</button>

      <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
        No account yet?{' '}
        <Link to="/register" style={{ color: '#f97316' }}>Create one</Link>
      </p>
    </div>
  </div>
)
}

export default Login