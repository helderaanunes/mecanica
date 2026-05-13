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

const ListarClientes = () => {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [modalExcluir, setModalExcluir] = useState(false)
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null)

  const carregarClientes = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/clientes')
      setClientes(response.data)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  const confirmarExclusao = (cliente) => {
    setClienteParaExcluir(cliente)
    setModalExcluir(true)
  }

  const executarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/clientes/${clienteParaExcluir.id}`)
      setModalExcluir(false)
      carregarClientes()
    } catch (error) {
      alert('Erro ao excluir cliente. Verifique se ele está vinculado a algum agendamento ou ordem de serviço.')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Lista de Clientes</strong>
            <CButton 
                color="secondary"
                className="text-white shadow-sm d-flex align-items-center" 
                onClick={() => navigate('/clientes/novo')}
                >
                <CIcon icon={cilPlus} className="me-2" size="lg" />
                Novo Cliente
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
                    <CTableHeaderCell>Nome</CTableHeaderCell>
                    <CTableHeaderCell>CPF/CNPJ</CTableHeaderCell>
                    <CTableHeaderCell>Celular</CTableHeaderCell>
                    <CTableHeaderCell>Cidade/UF</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ width: '20%' }}>Ações</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {clientes.map((cliente) => (
                    <CTableRow key={cliente.id}>
                      <CTableDataCell className="text-center">
                        {cliente.id}
                      </CTableDataCell>
                      <CTableDataCell>
                        {cliente.nome}
                      </CTableDataCell>
                      <CTableDataCell>
                        {cliente.cpfCnpj}
                      </CTableDataCell>
                      <CTableDataCell>
                        {cliente.celular}
                      </CTableDataCell>
                      <CTableDataCell>
                        {cliente.cidade} / {cliente.uf}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton 
                          color="info" 
                          variant="outline" 
                          size="sm" 
                          className="me-2"
                          onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        
                        <CButton 
                          color="danger" 
                          variant="outline" 
                          size="sm"
                          onClick={() => confirmarExclusao(cliente)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                  {clientes.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="6" className="text-center text-muted py-4">
                        Nenhum cliente cadastrado.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={modalExcluir} onClose={() => setModalExcluir(false)} alignment="center">
        <CModalHeader className="bg-warning">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilWarning} className="me-2" /> Atenção
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Tem certeza que deseja excluir o cliente <strong>{clienteParaExcluir?.nome}</strong>?
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

export default ListarClientes
