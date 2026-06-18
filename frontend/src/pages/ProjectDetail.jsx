import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getProjectById, approveProject, rejectProject, startupDecision, completeProject, sendFeedback } from '../services/api.js'

  function ProjectDetail() {
      const { id } = useParams()
      const { user } = useAuth()

      const [project, setProject] = useState(null)
      const [workProcesses, setWorkProcesses] = useState({})
      const [startupReden, setStartupReden] = useState('')
      const [feedback, setFeedback] = useState('')
      const [feedbackSent, setFeedbackSent] = useState(false)

      // if not logged in, block immediately
      if (!user) return <Navigate to="/" />

      useEffect(() => {
          if (!user) return
          async function loadProject() {
              const data = await getProjectById(id)
              setProject(data.project)
              setWorkProcesses(data.work_processes || {})
          }
          loadProject()
      }, [id])

      async function handleFeedback() {
          if (!feedback.trim()) return
          await sendFeedback(id, feedback)
          const data = await getProjectById(id)
          setProject(data.project)
          setWorkProcesses(data.work_processes || {})
          setFeedback('')
          setFeedbackSent(true)
      }

      async function handleStartupApprove() {
          await startupDecision(id, true, '')
          const data = await getProjectById(id)
          setProject(data.project)
          setWorkProcesses(data.work_processes || {})
      }

      async function handleStartupReject() {
          await startupDecision(id, false, startupReden)
          const data = await getProjectById(id)
          setProject(data.project)
          setWorkProcesses(data.work_processes || {})
      }

      async function handleComplete() {
          await completeProject(id)
          const data = await getProjectById(id)
          setProject(data.project)
          setWorkProcesses(data.work_processes || {})
      }

      async function handleApprove() {
          await approveProject(id)
          const data = await getProjectById(id)
          setProject(data.project)
          setWorkProcesses(data.work_processes || {})
      }

      async function handleReject() {
          await rejectProject(id)
          const data = await getProjectById(id)
          setProject(data.project)
          setWorkProcesses(data.work_processes || {})
      }

      if (project === null) {
          return <p>Loading...</p>
      }

      return (
          <div className="page">
            <div className="card">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
                <h1 className="card-title" style={{marginBottom: 0}}>{project.onderwerp}</h1>
                <span className={'badge badge-' + project.status}>{project.status}</span>
              </div>

              <div className="detail-field">
                <p className="detail-field-label">Start Date</p>
                <p className="detail-field-value">{project.startdatum}</p>
              </div>

              <div className="detail-field">
                <p className="detail-field-label">End Date</p>
                <p className="detail-field-value">{project.einddatum}</p>
              </div>

              <div className="detail-field">
                <p className="detail-field-label">Learning Goals</p>
                <p className="detail-field-value">{project.leerdoelen}</p>
              </div>

              <div className="detail-field">
                <p className="detail-field-label">Reflection</p>
                <p className="detail-field-value">{project.reflectie}</p>
              </div>

              <div className="detail-field">
                <p className="detail-field-label">Own Assessment</p>
                <p className="detail-field-value">{project.eigen_beoordeling}</p>
              </div>

              <div className="detail-field">
                <p className="detail-field-label">Feed Forward</p>
                <p className="detail-field-value">{project.feed_forward}</p>
              </div>

              <div className="detail-field">
                <p className="detail-field-label">Work Processes</p>
                <div className="checkbox-grid" style={{ marginTop: '8px' }}>
                  {['b1_k1_w1','b1_k1_w2','b1_k1_w3','b1_k1_w4','b1_k1_w5','b1_k2_w1','b1_k2_w2','b1_k2_w3'].map((key) => (
                    <label className="checkbox-label" key={key}>
                      <input type="checkbox" readOnly checked={!!workProcesses[key]} />
                      {key.replace(/_/g, '-').toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>

              {/* teacher message — shown to everyone when it exists */}
              {project.opmerkingen && (
                <div className="detail-field" style={{ background: '#fff7ed', borderRadius: '8px', padding: '14px', marginBottom: '8px' }}>
                  <p className="detail-field-label">Message from teacher</p>
                  <p className="detail-field-value">{project.opmerkingen}</p>
                </div>
              )}

              {/* teacher can write a message when project is completed */}
              {user.rol === 'docent' && project.status === 'Completed' && (
                <div style={{ marginTop: '16px', borderTop: '1px solid #fed7aa', paddingTop: '16px' }}>
                  <label className="form-label">Write a message to the student</label>
                  <textarea
                    className="input"
                    placeholder="Write your feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  {feedbackSent && (
                    <p style={{ color: '#16a34a', fontSize: '0.9rem', marginBottom: '8px' }}>✓ Message sent!</p>
                  )}
                  <button className="btn btn-primary" onClick={handleFeedback}>
                    Send message
                  </button>
                </div>
              )}

              {/* finish button — only for students, only when not done yet */}
              {user.rol === 'student' && project.status !== 'Completed' && project.status !== 'Rejected' && (
                <div style={{ marginTop: '24px', borderTop: '1px solid #fed7aa', paddingTop: '16px' }}>
                  <button className="btn btn-finish" onClick={handleComplete}>
                    ✓ Mark as Finished
                  </button>
                </div>
              )}

              {/* Startup approval — shown to both student and teacher */}
              <div className="detail-field" style={{ borderTop: '1px solid #fed7aa', paddingTop: '16px', marginTop: '8px' }}>
                <p className="detail-field-label">Startup Approval</p>

                {/* not decided yet */}
                {project.startup_goedgekeurd === null || project.startup_goedgekeurd === undefined ? (
                  <p className="detail-field-value" style={{ color: '#94a3b8' }}>No decision yet</p>
                ) : project.startup_goedgekeurd === 1 ? (
                  <p className="detail-field-value" style={{ color: '#16a34a', fontWeight: '600' }}>✓ Approved to start</p>
                ) : (
                  <div>
                    <p className="detail-field-value" style={{ color: '#dc2626', fontWeight: '600' }}>✗ Not allowed to start</p>
                    {project.startup_reden && (
                      <p style={{ marginTop: '6px', color: '#475569', fontStyle: 'italic' }}>
                        Reason: {project.startup_reden}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* teacher can give startup decision — only when no decision has been made yet */}
              {user.rol === 'docent' && project.startup_goedgekeurd === null || user.rol === 'docent' && project.startup_goedgekeurd === undefined ? (
                <div style={{ marginTop: '16px' }}>
                  <p className="form-label">Give startup decision</p>
                  <textarea
                    className="input"
                    placeholder="Write a reason here (required when rejecting)"
                    value={startupReden}
                    onChange={(e) => setStartupReden(e.target.value)}
                  />
                  <div className="detail-actions">
                    <button className="btn btn-primary" onClick={handleStartupApprove}>
                      Allow to start
                    </button>
                    <button className="btn btn-danger" onClick={handleStartupReject}>
                      Do not allow
                    </button>
                  </div>
                </div>
              ) : null}

              {/* final approve/reject */}
              {user.rol === 'docent' && (
                  <div className="detail-actions" style={{ marginTop: '12px', borderTop: '1px solid #fed7aa', paddingTop: '16px' }}>
                      <button className="btn btn-primary" onClick={handleApprove}>Approve project</button>
                      <button className="btn btn-danger" onClick={handleReject}>Reject project</button>
                  </div>
              )}
            </div>
          </div>
      )
  }

  export default ProjectDetail

