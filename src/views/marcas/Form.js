import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios' // 1. FALTA: Importar o axios
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

const MarcaForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [descricao, setDescricao] = useState('')
  const [validated, setValidated] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 2. FALTA: Buscar dados reais para edição
  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:8080/api/marcas/${id}`)
        .then(response => {
          setDescricao(response.data.descricao)
        })
        .catch(error => {
          setErrorMessage('Erro ao carregar os dados da marca.')
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
        // Chamada para o seu @PutMapping("/{id}") no Java
        await axios.put(`http://localhost:8080/api/marcas/${id}`, payload)
      } else {
        // Chamada para o seu @PostMapping no Java
        await axios.post('http://localhost:8080/api/marcas', payload)
      }
      
      setModalSuccess(true)
    } catch (error) {
      // 3. MELHORIA: Capturar mensagem vinda do Spring (se houver)
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
            <strong>{isEdit ? 'Editar Marca' : 'Cadastrar Nova Marca'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CCol md={12}>
                <CFormLabel htmlFor="descricao">Nome/Descrição da Marca</CFormLabel>
                <CFormInput
                  type="text"
                  id="descricao"
                  placeholder="Ex: Toyota, Honda, Ford..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  feedbackInvalid="Por favor, insira o nome da marca."
                />
              </CCol>

              <CCol xs={12} className="d-flex justify-content-end gap-2 mt-4">
                <CButton color="secondary" variant="outline" onClick={() => navigate('/marcas/listar')}>
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Cancelar
                </CButton>
                <CButton color="primary" type="submit">
                  <CIcon icon={cilSave} className="me-2" />
                  {isEdit ? 'Salvar Alterações' : 'Salvar Marca'}
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
          navigate('/marcas/listar') // Redireciona após sucesso
        }}
      >
        <CModalHeader className="bg-success text-white">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilCheckCircle} className="me-2" size="xl" />
            Sucesso!
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          A marca <strong>{descricao}</strong> foi {isEdit ? 'atualizada' : 'cadastrada'} com sucesso no sistema.
        </CModalBody>
        <CModalFooter>
          <CButton color="success" className="text-white" onClick={() => navigate('/marcas/listar')}>
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

export default MarcaForm