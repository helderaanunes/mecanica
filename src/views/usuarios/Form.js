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

const UsuarioForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [validated, setValidated] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:8080/usuarios/${id}`)
        .then(response => {
          setNome(response.data.nome)
          setEmail(response.data.email)
        })
        .catch(() => {
          setErrorMessage('Erro ao carregar os dados do usuário.')
          setModalError(true)
        })
    }
  }, [id, isEdit])

  const handleSubmit = async (event) => {
    const form = event.currentTarget
    event.preventDefault()

    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
      return
    }

    const payload = { nome, email, senha }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:8080/usuarios/${id}`, payload)
      } else {
        await axios.post('http://localhost:8080/usuarios', payload)
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
          <CCardHeader className="bg-dark text-white">
            <strong>{isEdit ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</strong>
          </CCardHeader>

          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>

              <CCol md={12}>
                <CFormLabel>Nome</CFormLabel>
                <CFormInput
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </CCol>

              <CCol md={12}>
                <CFormLabel>Email</CFormLabel>
                <CFormInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </CCol>

              {!isEdit && (
                <CCol md={12}>
                  <CFormLabel>Senha</CFormLabel>
                  <CFormInput
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </CCol>
              )}

              <CCol className="d-flex justify-content-end gap-2 mt-4">
                <CButton color="secondary" onClick={() => navigate('/usuarios/listar')}>
                  <CIcon icon={cilArrowLeft} /> Cancelar
                </CButton>

                <CButton type="submit" color="primary">
                  <CIcon icon={cilSave} /> Salvar
                </CButton>
              </CCol>

            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal Sucesso */}
      <CModal visible={modalSuccess}>
        <CModalHeader className="bg-success text-white">
          <CModalTitle>
            <CIcon icon={cilCheckCircle} /> Sucesso
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          Usuário {isEdit ? 'atualizado' : 'cadastrado'} com sucesso!
        </CModalBody>

        <CModalFooter>
          <CButton onClick={() => navigate('/usuarios/listar')}>
            OK
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Erro */}
      <CModal visible={modalError}>
        <CModalHeader className="bg-danger text-white">
          <CModalTitle>
            <CIcon icon={cilXCircle} /> Erro
          </CModalTitle>
        </CModalHeader>

        <CModalBody>{errorMessage}</CModalBody>

        <CModalFooter>
          <CButton onClick={() => setModalError(false)}>
            Fechar
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default UsuarioForm