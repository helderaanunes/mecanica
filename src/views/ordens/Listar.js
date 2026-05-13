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

const ListarOrdens = () => {
  const navigate = useNavigate()
  const [ordens, setOrdens] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalExcluir, setModalExcluir] = useState(false)
  const [ordemParaExcluir, setOrdemParaExcluir] = useState(null)

  const carregarOrdens = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/ordens')
      setOrdens(response.data)
    } catch (error) {
      console.error('Erro ao buscar ordens:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarOrdens()
  }, [])

  const confirmarExclusao = (ordem) => {
    setOrdemParaExcluir(ordem)
    setModalExcluir(true)
  }

  const executarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:8080/ordens/${ordemParaExcluir.id}`)
      setModalExcluir(false)
      carregarOrdens()
    } catch (error) {
      alert('Erro ao excluir ordem de serviço.')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">

          {/* HEADER COM BOTÃO */}
          <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Lista de Ordens de Serviços</strong>

            <CButton
              color="secondary"
              className="text-white shadow-sm d-flex align-items-center"
              onClick={() => navigate('/ordens/novo')}
            >
              <CIcon icon={cilPlus} className="me-2" size="lg" />
              Nova Ordem
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
                    <CTableHeaderCell className="text-center" style={{ width: '8%' }}>
                      ID
                    </CTableHeaderCell>
                    <CTableHeaderCell>Data</CTableHeaderCell>
                    <CTableHeaderCell>Veículo</CTableHeaderCell>
                    <CTableHeaderCell>Valor Total</CTableHeaderCell>
                    <CTableHeaderCell>Desconto</CTableHeaderCell>
                    <CTableHeaderCell>Valor Líquido</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ width: '18%' }}>
                      Ações
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {ordens.map((ordem) => (
                    <CTableRow key={ordem.id}>
                      <CTableDataCell className="text-center">
                        {ordem.id}
                      </CTableDataCell>

                      <CTableDataCell>
                        {ordem.dataHora
                          ? new Date(ordem.dataHora).toLocaleString()
                          : '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {ordem.veiculo?.placa || '-'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(ordem.valorTotal)}
                      </CTableDataCell>

                      <CTableDataCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(ordem.desconto)}
                      </CTableDataCell>

                      <CTableDataCell>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(ordem.valorLiquido)}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">

                        {/* EDITAR */}
                        <CButton
                          color="info"
                          variant="outline"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/ordens/editar/${ordem.id}`)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>

                        {/* EXCLUIR */}
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          onClick={() => confirmarExclusao(ordem)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>

                      </CTableDataCell>
                    </CTableRow>
                  ))}

                  {ordens.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="7" className="text-center text-muted py-4">
                        Nenhuma ordem cadastrada.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>

              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* MODAL */}
      <CModal visible={modalExcluir} onClose={() => setModalExcluir(false)} alignment="center">
        <CModalHeader className="bg-warning">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilWarning} className="me-2" /> Atenção
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          Tem certeza que deseja excluir a ordem <strong>#{ordemParaExcluir?.id}</strong>?
          <br />
          <small className="text-danger">Essa ação não poderá ser desfeita.</small>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalExcluir(false)}>
            <CIcon icon={cilBan} className="me-2" />
            Cancelar
          </CButton>

          <CButton color="danger" className="text-white" onClick={executarExclusao}>
            <CIcon icon={cilTrash} className="me-2" />
            Excluir permanentemente
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ListarOrdens