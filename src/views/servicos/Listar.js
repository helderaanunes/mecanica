import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CSpinner,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilWarning, cilBan } from '@coreui/icons'

const ListarServicos = () => {
  const navigate = useNavigate()
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [modalExcluir, setModalExcluir] = useState(false)
  const [servicoParaExcluir, setServicoParaExcluir] = useState(null)

  const carregarServicos = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/servicos')
      setServicos(response.data)
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarServicos()
  }, [])

  const confirmarExclusao = (servico) => {
    setServicoParaExcluir(servico)
    setModalExcluir(true)
  }

  const executarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/servicos/${servicoParaExcluir.id}`)
      setModalExcluir(false)
      carregarServicos()
    } catch (error) {
      alert('Erro ao excluir serviço. Verifique se ele está vinculado a alguma ordem de serviço.')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Lista de Serviços</strong>
            <CButton 
                color="secondary"
                className="text-white shadow-sm d-flex align-items-center" 
                onClick={() => navigate('/servicos/novo')}
                >
                <CIcon icon={cilPlus} className="me-2" size="lg" />
                Novo Serviço
            </CButton>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <div className="text-center p-5">
                <CSpinner color="primary" />
              </div>
            ) : (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center" style={{ width: '10%' }}>ID</CTableHeaderCell>
                    <CTableHeaderCell>Descrição</CTableHeaderCell>
                    <CTableHeaderCell>Valor</CTableHeaderCell>
                    <CTableHeaderCell>Duração (minutos)</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ width: '20%' }}>Ações</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {servicos.map((servico) => (
                    <CTableRow key={servico.id}>
                      <CTableDataCell className="text-center">
                        {servico.id}
                      </CTableDataCell>
                      <CTableDataCell>
                        {servico.descricao}
                      </CTableDataCell>
                      <CTableDataCell>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(servico.valor)}
                      </CTableDataCell>
                      <CTableDataCell>
                        {servico.duracao} min
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {/* Botão Editar: Navega para o formulário passando o ID */}
                        <CButton 
                          color="info" 
                          variant="outline" 
                          size="sm" 
                          className="me-2"
                          onClick={() => navigate(`/servicos/editar/${servico.id}`)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        
                        {/* Botão Excluir */}
                        <CButton 
                          color="danger" 
                          variant="outline" 
                          size="sm"
                          onClick={() => confirmarExclusao(servico)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  {servicos.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center text-muted py-4">
                        Nenhum serviço cadastrado.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal de Confirmação de Exclusão */}
      <CModal visible={modalExcluir} onClose={() => setModalExcluir(false)} alignment="center">
        <CModalHeader className="bg-warning">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilWarning} className="me-2" /> Atenção
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja excluir o serviço <strong>{servicoParaExcluir?.descricao}</strong>?
          <br />
          <small className="text-danger">Essa ação não poderá ser desfeita.</small>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalExcluir(false)}><CIcon icon={cilBan}  className="me-2" />Cancelar</CButton>
          <CButton color="danger" className="text-white" onClick={executarExclusao}><CIcon icon={cilTrash} className="me-2" />Excluir permanentemente</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ListarServicos
