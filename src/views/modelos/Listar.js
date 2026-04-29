import React, { useEffect, useState } from 'react'
import axios from 'axios'
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
import { useNavigate } from 'react-router-dom'

const ModeloList = () => {
  const [modelos, setModelos] = useState([])
  const navigate = useNavigate()

  const carregar = () => {
    axios.get('http://localhost:8080/api/modelos')
      .then(res => setModelos(res.data))
  }

  useEffect(() => {
    carregar()
  }, [])

  const excluir = async (id) => {
    await axios.delete(`http://localhost:8080/api/modelos/${id}`)
    carregar()
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <strong>Modelos</strong>
        <CButton color="primary" onClick={() => navigate('/modelos/novo')}>
          Novo Modelo
        </CButton>
      </CCardHeader>

      <CCardBody>
        <CTable striped hover>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Descrição</CTableHeaderCell>
              <CTableHeaderCell>Marca</CTableHeaderCell>
              <CTableHeaderCell>Ações</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {modelos.map(m => (
              <CTableRow key={m.id}>
                <CTableDataCell>{m.id}</CTableDataCell>
                <CTableDataCell>{m.descricao}</CTableDataCell>
                <CTableDataCell>{m.marca?.descricao}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="warning"
                    size="sm"
                    onClick={() => navigate(`/modelos/editar/${m.id}`)}
                    className="me-2"
                  >
                    Editar
                  </CButton>

                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => excluir(m.id)}
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

export default ModeloList