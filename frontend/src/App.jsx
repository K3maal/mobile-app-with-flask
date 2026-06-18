import  React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import TeacherDashboard from './pages/TeacherDashboard.jsx'
import CreateProject from './pages/CreateProject.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Navbar from './components/Navbar.jsx'

function App(){
    return(
        <BrowserRouter>
        <Navbar />
         <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/student" element={<StudentDashboard/>}/>
            <Route path="/teacher" element={<TeacherDashboard/>}/>
            <Route path="/create" element={<CreateProject/>}/>
            <Route path="/project/:id" element={<ProjectDetail/>}/>
         </Routes>
        </BrowserRouter>
    )
}
export default App
