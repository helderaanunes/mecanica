import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState([])
  const navigate = useNavigate()

  const carregarUsuarios = () => {
    axios.get('http://localhost:8080/usuarios')
      .then(res => setUsuarios(res.data))
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const deletar = async (id) => {
    await axios.delete(`http://localhost:8080/usuarios/${id}`)
    carregarUsuarios()
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <strong>Lista de Usuários</strong>

        <CButton onClick={() => navigate('/usuarios/novo')}>
          Novo Usuário
        </CButton>
      </CCardHeader>

      <CCardBody>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Nome</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Ações</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {usuarios.map(u => (
              <CTableRow key={u.id}>
                <CTableDataCell>{u.id}</CTableDataCell>
                <CTableDataCell>{u.nome}</CTableDataCell>
                <CTableDataCell>{u.email}</CTableDataCell>

                <CTableDataCell>
                  <CButton
                    size="sm"
                    color="warning"
                    onClick={() => navigate(`/usuarios/editar/${u.id}`)}
                  >
                    Editar
                  </CButton>

                  <CButton
                    size="sm"
                    color="danger"
                    className="ms-2"
                    onClick={() => deletar(u.id)}
                  >
                    Excluir
                  </CButton>
                </CTableDataCell>

              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default UsuarioList