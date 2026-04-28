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

const ServicoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [duracao, setDuracao] = useState('')
  
  const [validated, setValidated] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:8080/api/servicos/${id}`)
        .then(response => {
          setDescricao(response.data.descricao)
          setValor(response.data.valor)
          setDuracao(response.data.duracao)
        })
        .catch(error => {
          setErrorMessage('Erro ao carregar os dados do serviço.')
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

    const payload = { 
      descricao, 
      valor: parseFloat(valor), 
      duracao: parseInt(duracao, 10) 
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:8080/api/servicos/${id}`, payload)
      } else {
        await axios.post('http://localhost:8080/api/servicos', payload)
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
            <strong>{isEdit ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CCol md={6}>
                <CFormLabel htmlFor="descricao">Descrição do Serviço</CFormLabel>
                <CFormInput
                  type="text"
                  id="descricao"
                  placeholder="Ex: Troca de Óleo, Alinhamento..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  feedbackInvalid="Por favor, insira a descrição."
                />
              </CCol>

              <CCol md={3}>
                <CFormLabel htmlFor="valor">Valor (R$)</CFormLabel>
                <CFormInput
                  type="number"
                  step="0.01"
                  min="0"
                  id="valor"
                  placeholder="0.00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                  feedbackInvalid="Por favor, insira um valor válido."
                />
              </CCol>

              <CCol md={3}>
                <CFormLabel htmlFor="duracao">Duração (Minutos)</CFormLabel>
                <CFormInput
                  type="number"
                  min="1"
                  id="duracao"
                  placeholder="Ex: 60"
                  value={duracao}
                  onChange={(e) => setDuracao(e.target.value)}
                  required
                  feedbackInvalid="Por favor, insira a duração."
                />
              </CCol>

              <CCol xs={12} className="d-flex justify-content-end gap-2 mt-4">
                <CButton color="secondary" variant="outline" onClick={() => navigate('/servicos/listar')}>
                  <CIcon icon={cilArrowLeft} className="me-2" />
                  Cancelar
                </CButton>
                <CButton color="primary" type="submit">
                  <CIcon icon={cilSave} className="me-2" />
                  {isEdit ? 'Salvar Alterações' : 'Salvar Serviço'}
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
          navigate('/servicos/listar')
        }}
      >
        <CModalHeader className="bg-success text-white">
          <CModalTitle className="d-flex align-items-center">
            <CIcon icon={cilCheckCircle} className="me-2" size="xl" />
            Sucesso!
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          O serviço <strong>{descricao}</strong> foi {isEdit ? 'atualizado' : 'cadastrado'} com sucesso no sistema.
        </CModalBody>
        <CModalFooter>
          <CButton color="success" className="text-white" onClick={() => navigate('/servicos/listar')}>
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

export default ServicoForm
