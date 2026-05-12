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

const ClienteForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    nome: '',
    celular: '',
    email: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    cpfCnpj: ''
  })
  
  const [validated, setValidated] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:8080/api/clientes/${id}`)
        .then(response => {
          setFormData(response.data)
        })
        .catch(error => {
          setErrorMessage('Erro ao carregar os dados do cliente.')
          setModalError(true)
        })
    }
  }, [id, isEdit])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
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
        await axios.put(`http://localhost:8080/api/clientes/${id}`, formData)
      } else {
        await axios.post('http://localhost:8080/api/clientes', formData)
      }
      
      setModalSuccess(true)
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao conectar com o servidor.'
      setErrorMessage(msg)
      setModalError(true)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>{isEdit ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CCol md={6}>
                <CFormLabel htmlFor="nome">Nome Completo</CFormLabel>
                <CFormInput
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </CCol>

              <CCol md={3}>
                <CFormLabel htmlFor="cpfCnpj">CPF / CNPJ</CFormLabel>
                <CFormInput
                  type="text"
                  id="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleInputChange}
                  required
                />
              </CCol>

              <CCol md={3}>
                <CFormLabel htmlFor="celular">Celular</CFormLabel>
                <CFormInput
                  type="text"
                  id="celular"
                  value={formData.celular}
                  onChange={handleInputChange}
                  required
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel htmlFor="logradouro">Logradouro</CFormLabel>
                <CFormInput
                  type="text"
                  id="logradouro"
                  value={formData.logradouro}
                  onChange={handleInputChange}
                />
              </CCol>

              <CCol md={2}>
                <CFormLabel htmlFor="numero">Número</CFormLabel>
                <CFormInput
                  type="text"
                  id="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="bairro">Bairro</CFormLabel>
                <CFormInput
                  type="text"
                  id="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel htmlFor="cidade">Cidade</CFormLabel>
                <CFormInput
                  type="text"
                  id="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                />
              </CCol>

              <CCol md={1}>
                <CFormLabel htmlFor="uf">UF</CFormLabel>
                <CFormInput
                  type="text"
                  id="uf"
                  maxLength="2"
                  value={formData.uf}
                  onChange={handleInputChange}
                />
              </CCol>

              <CCol md={3}>
                <CFormLabel htmlFor="cep">CEP</CFormLabel>
                <CFormInput
                  type="text"
                  id="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                />
              </CCol>

              <CCol md={12}>
                <CFormLabel htmlFor="complemento">Complemento</CFormLabel>
                <CFormInput
                  type="text"
                  id="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                />
              </CCol>

              <CCol xs={12} className="d-flex justify-content-end gap-2 mt-4">
                <CButton color="secondary" variant="outline" onClick={() => navigate('/clientes/listar')}>
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Cancelar
                </CButton>
                <CButton color="primary" type="submit">
                  <CIcon icon={cilSave} className="me-2" />
                  {isEdit ? 'Salvar Alterações' : 'Salvar Cliente'}
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal
        alignment="center"
        visible={modalSuccess}
        onClose={() => {
          setModalSuccess(false)
          navigate('/clientes/listar')
        }}
      >
        <CModalHeader className="bg-success text-white">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilCheckCircle} className="me-2" size="xl" />
            Sucesso!
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          O cliente <strong>{formData.nome}</strong> foi {isEdit ? 'atualizado' : 'cadastrado'} com sucesso no sistema.
        </CModalBody>
        <CModalFooter>
          <CButton color="success" className="text-white" onClick={() => navigate('/clientes/listar')}>
            Ok, entendi
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        alignment="center"
        visible={modalError}
        onClose={() => setModalError(false)}
      >
        <CModalHeader className="bg-danger text-white">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilXCircle} className="me-2" size="xl" />
            Erro ao Salvar
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {errorMessage}
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" className="text-white" onClick={() => setModalError(false)}>
            Tentar Novamente
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default ClienteForm
