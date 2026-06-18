import React, {useState, useEffect} from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getStudentProjects } from '../services/api.js'

function StudentDashboard(){
    const { user } = useAuth()
    const navigate = useNavigate()

    const [projects, setProjects] = useState([])

    useEffect(() => {
        if (!user) return
        async function loadProjects() {
            const result = await getStudentProjects(user.id)
            setProjects(result)
        }
        loadProjects()
    }, [user])

    // if not logged in or not a student, block immediately
    if (!user) return <Navigate to="/" />
    if (user.rol !== 'student') return <Navigate to="/" />

    return (
        <div className="page">
            <div className="dashboard-header">
                <h1>Welcome {user.naam}</h1>
                <button className="btn btn-primary" onClick={() => navigate('/create')}>
                    + New Project
                </button>
            </div>

            <p className="section-title">Your projects</p>

            {projects.map((project) => (
                <div className="project-item" key={project.id} onClick={() => navigate('/project/' + project.id)}>
                    <span className="project-item-subject">{project.onderwerp}</span>
                    <span className={'badge badge-' + project.status}>{project.status}</span>
                </div>
            ))}
        </div>
    )
}
export default StudentDashboard