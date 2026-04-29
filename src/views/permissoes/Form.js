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

const PermissaoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [descricao, setDescricao] = useState('')
  const [validated, setValidated] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:8080/api/permissoes/${id}`)
        .then(response => {
          setDescricao(response.data.descricao)
        })
        .catch(() => {
          setErrorMessage('Erro ao carregar os dados da permissão.')
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

    const payload = { descricao }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:8080/api/permissoes/${id}`, payload)
      } else {
        await axios.post(`http://localhost:8080/api/permissoes`, payload)
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
            <strong>{isEdit ? 'Editar Permissão' : 'Cadastrar Nova Permissão'}</strong>
          </CCardHeader>

          <CCardBody>
            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CCol md={12}>
                <CFormLabel htmlFor="descricao">Descrição da Permissão</CFormLabel>
                <CFormInput
                  type="text"
                  id="descricao"
                  placeholder="Ex: ADMIN, USUARIO, VISUALIZAR_RELATORIO..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  feedbackInvalid="Por favor, insira a descrição da permissão."
                />
              </CCol>

              <CCol xs={12} className="d-flex justify-content-end gap-2 mt-4">
                <CButton
                  color="secondary"
                  variant="outline"
                  onClick={() => navigate('/permissoes/listar')}
                >
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Cancelar
                </CButton>

                <CButton color="primary" type="submit">
                  <CIcon icon={cilSave} className="me-2" />
                  {isEdit ? 'Salvar Alterações' : 'Salvar Permissão'}
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal de Sucesso */}
      <CModal
        alignment="center"
        visible={modalSuccess}
        onClose={() => {
          setModalSuccess(false)
          navigate('/permissoes/listar')
        }}
      >
        <CModalHeader className="bg-success text-white">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilCheckCircle} className="me-2" size="xl" />
            Sucesso!
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          A permissão <strong>{descricao}</strong> foi {isEdit ? 'atualizada' : 'cadastrada'} com sucesso.
        </CModalBody>

        <CModalFooter>
          <CButton
            color="success"
            className="text-white"
            onClick={() => navigate('/permissoes/listar')}
          >
            Ok, entendi
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal de Erro */}
      <CModal
        alignment="center"
        visible={modalError}
        onClose={() => setModalError(false)}
      >
        <CModalHeader className="bg-danger text-white">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilXCircle} className="me-2" size="xl" />
            Erro
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          {errorMessage}
        </CModalBody>

        <CModalFooter>
          <CButton
            color="danger"
            className="text-white"
            onClick={() => setModalError(false)}
          >
            Tentar Novamente
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default PermissaoForm