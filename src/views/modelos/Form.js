import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormInput, 
  CFormLabel, CFormSelect, CRow, CModal, CModalHeader, CModalTitle, 
  CModalBody, CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle, cilSave, cilArrowLeft } from '@coreui/icons'

const ModeloForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [descricao, setDescricao] = useState('')
  const [marcaId, setMarcaId] = useState('')
  const [marcas, setMarcas] = useState([])
  const [validated, setValidated] = useState(false)

  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // 1. Carrega marcas para o dropdown
    axios.get('http://localhost:8080/api/marcas').then(r => setMarcas(r.data))

    // 2. Se for edição, carrega os dados do modelo
    if (isEdit) {
      axios.get(`http://localhost:8080/api/modelos/${id}`)
        .then(r => {
          setDescricao(r.data.descricao)
          setMarcaId(r.data.marca?.id || '')
        })
        .catch(() => {
          setErrorMessage('Erro ao carregar dados do modelo.')
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
      marca: { id: parseInt(marcaId) } 
    }

    try {
      if (isEdit) await axios.put(`http://localhost:8080/api/modelos/${id}`, payload)
      else await axios.post('http://localhost:8080/api/modelos', payload)
      setModalSuccess(true)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erro ao salvar o modelo.')
      setModalError(true)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white">
            <strong>{isEdit ? 'Editar Modelo' : 'Cadastrar Novo Modelo'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
              <CCol md={6}>
                <CFormLabel>Marca</CFormLabel>
                <CFormSelect value={marcaId} onChange={(e) => setMarcaId(e.target.value)} required>
                  <option value="">Selecione uma marca...</option>
                  {marcas.map(m => (
                    <option key={m.id} value={m.id}>{m.descricao}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Descrição do Modelo</CFormLabel>
                <CFormInput 
                    placeholder="Ex: Civic, Corolla, Uno..." 
                    value={descricao} 
                    onChange={(e) => setDescricao(e.target.value)} 
                    required 
                />
              </CCol>
              <CCol xs={12} className="d-flex justify-content-end gap-2 mt-4">
                <CButton color="secondary" variant="outline" onClick={() => navigate('/modelos/listar')}>
                  <CIcon icon={cilArrowLeft} className="me-2" /> Cancelar
                </CButton>
                <CButton color="primary" type="submit">
                  <CIcon icon={cilSave} className="me-2" /> Salvar
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modal Sucesso */}
      <CModal visible={modalSuccess} onClose={() => navigate('/modelos/listar')} alignment="center">
        <CModalHeader className="bg-success text-white">
          <CModalTitle><CIcon icon={cilCheckCircle} className="me-2" /> Sucesso!</CModalTitle>
        </CModalHeader>
        <CModalBody>Modelo salvo com sucesso.</CModalBody>
        <CModalFooter>
          <CButton color="success" className="text-white" onClick={() => navigate('/modelos/listar')}>Ok</CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Erro */}
      <CModal visible={modalError} onClose={() => setModalError(false)} alignment="center">
        <CModalHeader className="bg-danger text-white">
          <CModalTitle><CIcon icon={cilXCircle} className="me-2" /> Erro</CModalTitle>
        </CModalHeader>
        <CModalBody>{errorMessage}</CModalBody>
        <CModalFooter>
          <CButton color="danger" className="text-white" onClick={() => setModalError(false)}>Fechar</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}
export default ModeloForm