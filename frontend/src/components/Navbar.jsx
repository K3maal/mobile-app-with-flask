  import React from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import { useAuth } from '../context/AuthContext.jsx'

  function Navbar() {
      const { user, logout } = useAuth()
      const navigate = useNavigate()

      if (!user) {
          return null
      }

      function handleLogout() {
          logout()
          navigate('/')
      }

      return (
          <nav className="navbar">
              <span className="navbar-title">Project App</span>

              <div className="navbar-links">
                  {user.rol === 'student' && (
                      <Link to="/student">My Projects</Link>
                  )}

                  {user.rol === 'docent' && (
                      <Link to="/teacher">All Projects</Link>
                  )}

                  <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
              </div>
          </nav>
      )
  }

  export default Navbar
