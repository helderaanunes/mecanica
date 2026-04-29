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

const ListarPermissoes = () => {
  const navigate = useNavigate()

  const [permissoes, setPermissoes] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalExcluir, setModalExcluir] = useState(false)
  const [permissaoParaExcluir, setPermissaoParaExcluir] = useState(null)

  const carregarPermissoes = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/api/permissoes')
      setPermissoes(response.data)
    } catch (error) {
      console.error('Erro ao buscar permissões:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarPermissoes()
  }, [])

  const confirmarExclusao = (permissao) => {
    setPermissaoParaExcluir(permissao)
    setModalExcluir(true)
  }

  const executarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/permissoes/${permissaoParaExcluir.id}`)
      setModalExcluir(false)
      carregarPermissoes()
    } catch (error) {
      alert('Erro ao excluir permissão.')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Lista de Permissões</strong>

            <CButton
              color="secondary"
              className="text-white shadow-sm d-flex align-items-center"
              onClick={() => navigate('/permissoes/novo')}
            >
              <CIcon icon={cilPlus} className="me-2" size="lg" />
              Nova Permissão
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
                    <CTableHeaderCell className="text-center" style={{ width: '10%' }}>
                      ID
                    </CTableHeaderCell>
                    <CTableHeaderCell>Descrição</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ width: '20%' }}>
                      Ações
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {permissoes.map((permissao) => (
                    <CTableRow key={permissao.id}>
                      <CTableDataCell className="text-center">
                        {permissao.id}
                      </CTableDataCell>

                      <CTableDataCell>
                        {permissao.descricao}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {/* Editar */}
                        <CButton
                          color="info"
                          variant="outline"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/permissoes/editar/${permissao.id}`)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>

                        {/* Excluir */}
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          onClick={() => confirmarExclusao(permissao)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}

                  {permissoes.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="3" className="text-center text-muted py-4">
                        Nenhuma permissão cadastrada.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal de Exclusão */}
      <CModal visible={modalExcluir} onClose={() => setModalExcluir(false)} alignment="center">
        <CModalHeader className="bg-warning">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilWarning} className="me-2" />
            Atenção
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          Tem certeza que deseja excluir a permissão{' '}
          <strong>{permissaoParaExcluir?.descricao}</strong>?
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

export default ListarPermissoes