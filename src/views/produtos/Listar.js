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

const ProdutoList = () => {
  const navigate = useNavigate()
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  const [modalExcluir, setModalExcluir] = useState(false)
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null)

  const carregarProdutos = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:8080/produtos')
      setProdutos(response.data)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  const confirmarExclusao = (produto) => {
    setProdutoParaExcluir(produto)
    setModalExcluir(true)
  }

  const executarExclusao = async () => {
    try {
      await axios.delete(`http://localhost:8080/produtos/${produtoParaExcluir.id}`)
      setModalExcluir(false)
      carregarProdutos()
    } catch (error) {
      alert('Erro ao excluir produto.')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>Lista de Produtos</strong>

            <CButton
              color="secondary"
              className="text-white shadow-sm d-flex align-items-center"
              onClick={() => navigate('/produtos/novo')}
            >
              <CIcon icon={cilPlus} className="me-2" size="lg" />
              Novo Produto
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
                    <CTableHeaderCell>Preço Venda</CTableHeaderCell>
                    <CTableHeaderCell>Estoque</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={{ width: '20%' }}>
                      Ações
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {produtos.map((produto) => (
                    <CTableRow key={produto.id}>
                      <CTableDataCell className="text-center">
                        {produto.id}
                      </CTableDataCell>

                      <CTableDataCell>
                        {produto.descricao}
                      </CTableDataCell>

                      <CTableDataCell>
                        {produto.precoVenda}
                      </CTableDataCell>

                      <CTableDataCell>
                        {produto.quantidadeEstoque}
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        {/* Editar */}
                        <CButton
                          color="info"
                          variant="outline"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/produtos/${produto.id}`)}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>

                        {/* Excluir */}
                        <CButton
                          color="danger"
                          variant="outline"
                          size="sm"
                          onClick={() => confirmarExclusao(produto)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}

                  {produtos.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan="5" className="text-center text-muted py-4">
                        Nenhum produto cadastrado.
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
          Tem certeza que deseja excluir o produto{' '}
          <strong>{produtoParaExcluir?.descricao}</strong>?
          <br />
          <small className="text-danger">
            Essa ação não poderá ser desfeita.
          </small>
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

export default ProdutoList