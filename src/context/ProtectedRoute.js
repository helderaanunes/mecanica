import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()

  // Se estiver autenticado, renderiza a rota filha (Outlet), senão joga pro /login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute