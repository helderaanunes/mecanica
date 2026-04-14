import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, 
  CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, 
  CButton, CSpinner, CModal, CModalHeader, CModalTitle, 
  CModalBody, CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilWarning, cilBackspace, cilBan } from '@coreui/icons'

const ListarModelos = () => {
  const navigate = useNavigate()
  const [modelos, setModelos] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [modalExcluir, setModalExcluir] = useState(false)
  const [modeloParaExcluir, setModeloParaExcluir] = useState(null)

  const carregarModelos = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/modelos')
      setModelos(response.data)
    } catch (error) {
      console.error('Erro ao buscar modelos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarModelos() }, [])

  const confirmarExclusao = (modelo) => {
    setModeloParaExcluir(modelo)
    setModalExcluir(true)
  }

  const executarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/modelos/${modeloParaExcluir.id}`)
      setModalExcluir(false)
      carregarModelos()
    } catch (error) {
      alert('Erro ao excluir modelo. Pode haver veículos vinculados a ele.')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Lista de Modelos</strong>
            <CButton color="secondary" className="text-white shadow-sm d-flex align-items-center" onClick={() => navigate('/modelos/novo')}>
              <CIcon icon={cilPlus} className="me-2" size="lg" /> Novo Modelo
            </CButton>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <div className="text-center p-5"><CSpinner color="primary" /></div>
            ) : (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">ID</CTableHeaderCell>
                    <CTableHeaderCell>Marca</CTableHeaderCell>
                    <CTableHeaderCell>Descrição do Modelo</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Ações</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {modelos.map((m) => (
                    <CTableRow key={m.id}>
                      <CTableDataCell className="text-center">{m.id}</CTableDataCell>
                      <CTableDataCell>{m.marca?.descricao}</CTableDataCell>
                      <CTableDataCell>{m.descricao}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton color="info" variant="outline" size="sm" className="me-2" onClick={() => navigate(`/modelos/editar/${m.id}`)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" variant="outline" size="sm" onClick={() => confirmarExclusao(m)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={modalExcluir} onClose={() => setModalExcluir(false)} alignment="center">
        <CModalHeader className="bg-warning">
          <CModalTitle><CIcon icon={cilWarning} className="me-2" /> Atenção</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Deseja excluir o modelo <strong>{modeloParaExcluir?.descricao}</strong>?
          <br />
          <small className="text-danger">Essa ação não poderá ser desfeita.</small>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalExcluir(false)}><CIcon icon={cilBan}  className="me-2" />Cancelar</CButton>
          <CButton color="danger" className="text-white" onClick={executarExclusao}><CIcon icon={cilTrash} className="me-2" />Excluir</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}
export default ListarModelos