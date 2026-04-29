import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle, cilSave, cilArrowLeft } from '@coreui/icons'

const ProdutoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    descricao: '',
    precoFornecedor: '',
    precoVenda: '',
    quantidadeEstoque: '',
  })

  const [validated, setValidated] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:8080/produtos/${id}`)
        .then(response => setFormData(response.data))
        .catch(() => {
          setErrorMessage('Erro ao carregar produto.')
          setModalError(true)
        })
    }
  }, [id, isEdit])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    event.preventDefault()

    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
      return
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:8080/produtos/${id}`, formData)
      } else {
        await axios.post(`http://localhost:8080/produtos`, formData)
      }

      setModalSuccess(true)
    } catch (error) {
      setErrorMessage('Erro ao salvar produto.')
      setModalError(true)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white">
            <strong>{isEdit ? 'Editar Produto' : 'Cadastrar Produto'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>

              <CCol md={12}>
                <CFormLabel>Descrição</CFormLabel>
                <CFormInput name="descricao" value={formData.descricao} onChange={handleChange} required />
              </CCol>

              <CCol md={12}>
                <CFormLabel>Preço Fornecedor</CFormLabel>
                <CFormInput type="number" name="precoFornecedor" value={formData.precoFornecedor} onChange={handleChange} required />
              </CCol>

              <CCol md={12}>
                <CFormLabel>Preço Venda</CFormLabel>
                <CFormInput type="number" name="precoVenda" value={formData.precoVenda} onChange={handleChange} required />
              </CCol>

              <CCol md={12}>
                <CFormLabel>Estoque</CFormLabel>
                <CFormInput type="number" name="quantidadeEstoque" value={formData.quantidadeEstoque} onChange={handleChange} required />
              </CCol>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <CButton color="secondary" onClick={() => navigate('/produtos/listar')}>
                  <CIcon icon={cilArrowLeft} /> Cancelar
                </CButton>
                <CButton type="submit" color="primary">
                  <CIcon icon={cilSave} /> Salvar
                </CButton>
              </div>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* SUCESSO */}
      <CModal visible={modalSuccess}>
        <CModalHeader className="bg-success text-white">
          <CModalTitle>
            <CIcon icon={cilCheckCircle}/> Sucesso
          </CModalTitle>
        </CModalHeader>
        <CModalBody>Produto salvo com sucesso!</CModalBody>
        <CModalFooter>
          <CButton onClick={() => navigate('/produtos/listar')}>OK</CButton>
        </CModalFooter>
      </CModal>

      {/* ERRO */}
      <CModal visible={modalError}>
        <CModalHeader className="bg-danger text-white">
          <CModalTitle>
            <CIcon icon={cilXCircle}/> Erro
          </CModalTitle>
        </CModalHeader>
        <CModalBody>{errorMessage}</CModalBody>
        <CModalFooter>
          <CButton onClick={() => setModalError(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ProdutoForm