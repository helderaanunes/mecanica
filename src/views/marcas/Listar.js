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
import { cilPencil, cilTrash, cilPlus, cilWarning } from '@coreui/icons'

const ListarMarcas = () => {
  const navigate = useNavigate()
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados para exclusão
  const [modalExcluir, setModalExcluir] = useState(false)
  const [marcaParaExcluir, setMarcaParaExcluir] = useState(null)

  // 1. Carregar marcas ao iniciar a tela
  const carregarMarcas = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/marcas')
      setMarcas(response.data)
    } catch (error) {
      console.error('Erro ao buscar marcas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarMarcas()
  }, [])

  // 2. Função para confirmar exclusão
  const confirmarExclusao = (marca) => {
    setMarcaParaExcluir(marca)
    setModalExcluir(true)
  }

  const executarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/marcas/${marcaParaExcluir.id}`)
      setModalExcluir(false)
      carregarMarcas() // Atualiza a lista após deletar
    } catch (error) {
      alert('Erro ao excluir marca. Verifique se ela está vinculada a algum veículo.')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Lista de Marcas</strong>
            <CButton 
                color="secondary"
                className="text-white shadow-sm d-flex align-items-center" 
                onClick={() => navigate('/marcas/novo')}
                >
                <CIcon icon={cilPlus} className="me-2" size="lg" />
                Nova Marca
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
                    <CTableHeaderCell className="text-center" style={{ width: '20%' }}>Ações</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {marcas.map((marca) => (
                    <CTableRow v-for="item in tableItems" key={marca.id}>
                      <CTableDataCell className="text-center">
                        {marca.id}
                      </CTableDataCell>
                      <CTableDataCell>
                        {marca.descricao}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        {/* Botão Editar: Navega para o formulário passando o ID */}
                        <CButton 
                          color="info" 
                          variant="outline" 
                          size="sm" 
                          className="me-2"
                          onClick={() => navigate(`/marcas/editar/${marca.id}`)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        
                        {/* Botão Excluir */}
                        <CButton 
                          color="danger" 
                          variant="outline" 
                          size="sm"
                          onClick={() => confirmarExclusao(marca)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  {marcas.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="3" className="text-center text-muted py-4">
                        Nenhuma marca cadastrada.
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
          Tem certeza que deseja excluir a marca <strong>{marcaParaExcluir?.descricao}</strong>?
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

export default ListarMarcas