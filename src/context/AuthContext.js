import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(localStorage.getItem('token'))
  const login = async (email, senha) => {
    try {
      // Faz a requisição para o seu Spring Boot
      const response = await axios.post('http://localhost:8080/login', { email, senha })
      // Captura o token de dentro do DadosTokenJWT retornado pelo controller
      const token = response.data.token 
      localStorage.setItem('token', token)
      setUserToken(token)
      // Garante que a estrutura de objetos do Axios exista antes de injetar o token
      if (!axios.defaults.headers) axios.defaults.headers = {}
      if (!axios.defaults.headers.common) axios.defaults.headers.common = {}
      // Define o cabeçalho global de autorização para as próximas chamadas
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      return true
    } catch (error) {
      console.error('Erro ao efetuar login:', error)
      throw error
    }
  }
  const logout = () => {
    localStorage.removeItem('token')
    setUserToken(null)
    if (axios.defaults.headers && axios.defaults.headers.common) {
      delete axios.defaults.headers.common['Authorization']
    }
  }
  // Monitora o estado do token para requisições manuais ou recarregamentos de página (F5)
  useEffect(() => {
    if (userToken) {
      if (!axios.defaults.headers) axios.defaults.headers = {}
      if (!axios.defaults.headers.common) axios.defaults.headers.common = {}
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
    }
  }, [userToken])
  return (
    <AuthContext.Provider value={{ isAuthenticated: !!userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)