import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getAllProjects } from '../services/api.js'

  function TeacherDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [projects, setProjects] = useState([])

    useEffect(() => {
      if (!user) return
      async function loadProjects() {
        const result = await getAllProjects()
        setProjects(result)
      }
      loadProjects()
    }, [user])

    // if not logged in or not a teacher, block immediately
    if (!user) return <Navigate to="/" />
    if (user.rol !== 'docent') return <Navigate to="/" />

    return (
      <div className="page">
        <div className="dashboard-header">
          <h1>Welcome {user.naam}</h1>
        </div>

        <p className="section-title">All Projects</p>

        {projects.map((project) => (
          <div
            className="project-item"
            key={project.id}
            onClick={() => navigate('/project/' + project.id)}
            style={project.status === 'Completed' ? { borderLeft: '4px solid #16a34a' } : {}}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="project-item-subject">{project.onderwerp}</span>
                {project.status === 'Completed' && (
                  <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '1rem' }}>✓ Finished</span>
                )}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                {project.student_naam} — {project.studentnummer}
              </p>
            </div>
            <span className={'badge badge-' + project.status}>{project.status}</span>
          </div>
        ))}
      </div>
    )
  }

  export default TeacherDashboard

