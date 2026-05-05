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

  const [cliente, setCliente] = useState({
    nome: '',
    celular: '',
    email: ''
  })

  const [validated, setValidated] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:8080/api/clientes/${id}`)
        .then(response => {
          setCliente(response.data)
        })
        .catch(() => {
          setErrorMessage('Erro ao carregar cliente.')
          setModalError(true)
        })
    }
  }, [id, isEdit])

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value })
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
        await axios.put(`http://localhost:8080/api/clientes/${id}`, cliente)
      } else {
        await axios.post(`http://localhost:8080/api/clientes`, cliente)
      }

      setModalSuccess(true)
    } catch (error) {
      setErrorMessage('Erro ao salvar cliente.')
      setModalError(true)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white">
            <strong>{isEdit ? 'Editar Cliente' : 'Cadastrar Cliente'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>

              <CCol md={12}>
                <CFormLabel>Nome</CFormLabel>
                <CFormInput name="nome" value={cliente.nome} onChange={handleChange} required />
              </CCol>

              <CCol md={12}>
                <CFormLabel>Celular</CFormLabel>
                <CFormInput name="celular" value={cliente.celular} onChange={handleChange} />
              </CCol>

              <CCol md={12}>
                <CFormLabel>Email</CFormLabel>
                <CFormInput name="email" value={cliente.email} onChange={handleChange} />
              </CCol>

              <CCol xs={12} className="d-flex justify-content-end gap-2 mt-4">
                <CButton color="secondary" onClick={() => navigate('/clientes/listar')}>
                  <CIcon icon={cilArrowLeft} /> Cancelar
                </CButton>

                <CButton color="primary" type="submit">
                  <CIcon icon={cilSave} /> Salvar
                </CButton>
              </CCol>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* SUCESSO */}
      <CModal visible={modalSuccess} onClose={() => navigate('/clientes/listar')}>
        <CModalHeader className="bg-success text-white">
          <CModalTitle>Sucesso</CModalTitle>
        </CModalHeader>
        <CModalBody>Cliente salvo com sucesso!</CModalBody>
      </CModal>

      {/* ERRO */}
      <CModal visible={modalError} onClose={() => setModalError(false)}>
        <CModalHeader className="bg-danger text-white">
          <CModalTitle>Erro</CModalTitle>
        </CModalHeader>
        <CModalBody>{errorMessage}</CModalBody>
      </CModal>

    </CRow>
  )
}

export default ClienteForm
 