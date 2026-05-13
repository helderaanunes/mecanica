import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable,
  CTableBody, CTableDataCell, CTableHead, CTableHeaderCell,
  CTableRow, CButton, CSpinner, CModal, CModalHeader,
  CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilPlus, cilWarning, cilBan } from '@coreui/icons'

const ListarAgendamentos = () => {
  const navigate = useNavigate()
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalExcluir, setModalExcluir] = useState(false)
  const [itemParaExcluir, setItemParaExcluir] = useState(null)

  const carregarDados = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/agendamentos')
      setAgendamentos(response.data)
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarDados() }, [])

  const executarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/agendamentos/${itemParaExcluir.id}`)
      setModalExcluir(false)
      carregarDados()
    } catch (error) {
      alert('Erro ao excluir agendamento.')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Agenda de Serviços</strong>
            <CButton color="secondary" onClick={() => navigate('/agendamentos/novo')}>
              <CIcon icon={cilPlus} className="me-2" /> Novo Agendamento
            </CButton>
          </CCardHeader>
          <CCardBody>
            {loading ? (
              <div className="text-center p-5"><CSpinner color="primary" /></div>
            ) : (
              <CTable align="middle" hover responsive borderless className="mb-0 border">
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Data/Hora</CTableHeaderCell>
                    <CTableHeaderCell>Cliente</CTableHeaderCell>
                    <CTableHeaderCell>Serviço</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Ações</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {agendamentos.map((ag) => (
                    <CTableRow key={ag.id}>
                      <CTableDataCell>{new Date(ag.dataHora).toLocaleString()}</CTableDataCell>
                      <CTableDataCell>{ag.cliente?.nome}</CTableDataCell>
                      <CTableDataCell>{ag.servico?.descricao}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton color="info" variant="outline" size="sm" className="me-2"
                          onClick={() => navigate(`/agendamentos/editar/${ag.id}`)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" variant="outline" size="sm"
                          onClick={() => { setItemParaExcluir(ag); setModalExcluir(true); }}>
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

      {/* Modal de Confirmação */}
      <CModal visible={modalExcluir} onClose={() => setModalExcluir(false)} alignment="center">
        <CModalHeader className="bg-warning"><CModalTitle>Atenção</CModalTitle></CModalHeader>
        <CModalBody>Deseja cancelar o agendamento de <strong>{itemParaExcluir?.cliente?.nome}</strong>?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalExcluir(false)}><CIcon icon={cilBan} /> Sair</CButton>
          <CButton color="danger" className="text-white" onClick={executarExclusao}>Confirmar Exclusão</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ListarAgendamentos