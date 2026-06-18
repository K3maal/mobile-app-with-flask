import React, {createContext, useState, useContext}from 'react'
const AuthContext = createContext()

export function AuthProvider({children}){
    // when the app loads, check if a user was saved in localStorage
    const [user , setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })

    function login(userData) {
        setUser(userData)
        // save the user in localStorage so refresh does not log out
        localStorage.setItem('user', JSON.stringify(userData))
    }

    function logout(){
        setUser(null)
        // remove the user from localStorage on logout
        localStorage.removeItem('user')
    }

    return(
        <AuthContext.Provider value={{user, login,logout}}>
            {children}
            </AuthContext.Provider>
    )
}
export function useAuth(){
    return useContext(AuthContext)
}