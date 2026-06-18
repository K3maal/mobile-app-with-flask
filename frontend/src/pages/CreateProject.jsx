import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { createProject } from '../services/api.js'

function CreateProject() {
    const { user } = useAuth()
    const navigate = useNavigate()

    // if not logged in, block immediately
    if (!user) return <Navigate to="/" />

    const [onderwerp, setOnderwerp] = useState('')
    const [leerdoelen, setLeerdoelen] = useState('')
    const [startdatum, setStartdatum] = useState('')
    const [einddatum, setEinddatum] = useState('')

    const [error, setError] = useState('')

    const [b1k1w1, setB1k1w1] = useState(false)
    const [b1k1w2, setB1k1w2] = useState(false)
    const [b1k1w3, setB1k1w3] = useState(false)
    const [b1k1w4, setB1k1w4] = useState(false)
    const [b1k1w5, setB1k1w5] = useState(false)
    const [b1k2w1, setB1k2w1] = useState(false)
    const [b1k2w2, setB1k2w2] = useState(false)
    const [b1k2w3, setB1k2w3] = useState(false)

    async function handleSubmit(){
        // check that required fields are filled in
        if (!startdatum) {
            setError('Start date is required.')
            return
        }
        if (!einddatum) {
            setError('End date is required.')
            return
        }
        if (!leerdoelen.trim()) {
            setError('Learning goals are required.')
            return
        }
        setError('')

        const data = {
            student_id: user.id,
            onderwerp: onderwerp,
            leerdoelen: leerdoelen,
            startdatum: startdatum,
            einddatum: einddatum,
            b1_k1_w1:b1k1w1,
            b1_k1_w2:b1k1w2,
            b1_k1_w3:b1k1w3,
            b1_k1_w4:b1k1w4,
            b1_k1_w5:b1k1w5,
            b1_k2_w1:b1k2w1,
            b1_k2_w2:b1k2w2,
            b1_k2_w3:b1k2w3
        }
        await createProject(data)
        navigate('/student')
    }

    return(
        <div className="page">
          <div className="card">
            <h1 className="card-title">New Project</h1>

            <label className="form-label">Subject</label>
            <input
            className="input"
            type="text"
            placeholder="Subject"
            value={onderwerp}
            onChange={(e) => setOnderwerp(e.target.value)}
            />

            <label className="form-label">Learning Goals</label>
            <textarea
            className="input"
            placeholder="Write your learning goals here..."
            value={leerdoelen}
            onChange={(e) => setLeerdoelen(e.target.value)}
            />

            <label className="form-label">Start Date</label>
            <input
            className="input"
            type="date"
            value={startdatum}
            onChange={(e) => setStartdatum(e.target.value)}
            />

            <label className="form-label">End Date</label>
            <input
            className="input"
            type="date"
            value={einddatum}
            onChange={(e) => setEinddatum(e.target.value)}
            />

            <label className="form-label">Work Processes</label>
            <div className="checkbox-grid">
                <label className="checkbox-label">
                    <input type="checkbox" checked={b1k1w1} onChange={(e) => setB1k1w1(e.target.checked)} />
                    B1-K1-W1
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={b1k1w2} onChange={(e) => setB1k1w2(e.target.checked)} />
                    B1-K1-W2
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={b1k1w3} onChange={(e) => setB1k1w3(e.target.checked)} />
                    B1-K1-W3
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={b1k1w4} onChange={(e) => setB1k1w4(e.target.checked)} />
                    B1-K1-W4
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={b1k1w5} onChange={(e) => setB1k1w5(e.target.checked)} />
                    B1-K1-W5
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={b1k2w1} onChange={(e) => setB1k2w1(e.target.checked)} />
                    B1-K2-W1
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={b1k2w2} onChange={(e) => setB1k2w2(e.target.checked)} />
                    B1-K2-W2
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" checked={b1k2w3} onChange={(e) => setB1k2w3(e.target.checked)} />
                    B1-K2-W3
                </label>
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button className="btn btn-primary" onClick={handleSubmit}>Create Project</button>
          </div>
        </div>
    )
}
export default CreateProject