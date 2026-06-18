
const BASE_URL = 'http://10.45.14.221:5000'

export async function registerUser(naam, email, wachtwoord, rol, studentnummer){
  const response = await fetch(BASE_URL + '/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ naam, email, wachtwoord, rol, studentnummer })
  })
  return response.json()
}

export async function loginUser(email, wachtwoord){
  const response = await fetch(BASE_URL + '/api/login',{
    method: 'POST', 
    headers: { 'Content-Type':'application/json'},
    body: JSON.stringify({email, wachtwoord})
  })
  return response.json()
}

export async function getStudentProjects(student_id){
    const  response = await fetch(BASE_URL + '/api/student/projects?student_id=' + student_id)
    return response.json()

}
   
    export async function createProject(data){
        const response = await fetch(BASE_URL + '/api/student/projects',{
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        })
        return response.json()
    }

    export async function getAllProjects(){
        const response = await fetch(BASE_URL + '/api/docent/projects')
        return response.json()
    }


    

  export async function getProjectById(id){
      const response = await fetch(BASE_URL + '/api/student/projects/' + id)
      return response.json()
  }

  export async function completeProject(id){
      const response = await fetch(BASE_URL + '/api/student/projects/' + id + '/complete', {
          method: 'PUT'
      })
      return response.json()
  }

  export async function startupDecision(id, goedgekeurd, reden){
      const response = await fetch(BASE_URL + '/api/docent/projects/' + id + '/startup', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ goedgekeurd, reden })
      })
      return response.json()
  }

  export async function sendFeedback(id, feedback){
      const response = await fetch(BASE_URL + '/api/docent/projects/' + id + '/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedback })
      })
      return response.json()
  }

  export async function approveProject(id){
      const response = await fetch(BASE_URL + '/api/docent/projects/' + id + '/approve',{
          method: 'PUT'
      })
      return response.json()
  }

  export async function rejectProject(id){
      const response = await fetch(BASE_URL + '/api/docent/projects/' + id + '/reject',{
          method: 'PUT'
      })
      return response.json()
  }


