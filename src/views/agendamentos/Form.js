import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CButton, CCard, CCardBody, CCardHeader, CCol, CForm,
  CFormInput, CFormLabel, CRow, CModal, CModalHeader,
  CModalTitle, CModalBody, CModalFooter, CFormSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle, cilSave, cilArrowLeft } from '@coreui/icons'

const AgendamentoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  // Estados dos campos
  const [clienteId, setClienteId] = useState('')
  const [servicoId, setServicoId] = useState('')
  const [dataHora, setDataHora] = useState('')

  // Estados para dados externos (Selects)
  const [clientes, setClientes] = useState([])
  const [servicos, setServicos] = useState([])

  const [validated, setValidated] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // Carregar Clientes e Serviços para os selects
    const fetchData = async () => {
      try {
        const [resClientes, resServicos] = await Promise.all([
          axios.get('http://localhost:8080/api/clientes'),
          axios.get('http://localhost:8080/api/servicos')
        ])
        setClientes(resClientes.data)
        setServicos(resServicos.data)
      } catch (err) {
        console.error("Erro ao carregar dependências", err)
      }
    }

    fetchData()

    if (isEdit) {
      axios.get(`http://localhost:8080/api/agendamentos/${id}`)
        .then(response => {
          const data = response.data
          setClienteId(data.cliente.id)
          setServicoId(data.servico.id)
          setDataHora(data.dataHora.substring(0, 16)) // Formata para o input datetime-local
        })
        .catch(() => {
          setErrorMessage('Erro ao carregar dados do agendamento.')
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
      cliente: { id: parseInt(clienteId) },
      servico: { id: parseInt(servicoId) },
      dataHora: dataHora
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:8080/api/agendamentos/${id}`, payload)
      } else {
        await axios.post('http://localhost:8080/api/agendamentos', payload)
      }
      setModalSuccess(true)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erro ao salvar agendamento.')
      setModalError(true)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white d-flex justify-content-between align-items-center">
            <strong>{isEdit ? 'Editar Agendamento' : 'Novo Agendamento'}</strong>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>

              {/* Select de Cliente */}
              <CCol md={6}>
                <CFormLabel htmlFor="cliente">Cliente</CFormLabel>
                <CFormSelect
                  id="cliente"
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  required
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </CFormSelect>
              </CCol>

              {/* Select de Serviço */}
              <CCol md={6}>
                <CFormLabel htmlFor="servico">Serviço</CFormLabel>
                <CFormSelect
                  id="servico"
                  value={servicoId}
                  onChange={(e) => setServicoId(e.target.value)}
                  required
                >
                  <option value="">Selecione um serviço...</option>
                  {servicos.map(s => (
                    <option key={s.id} value={s.id}>{s.descricao}</option>
                  ))}
                </CFormSelect>
              </CCol>

              {/* Input de Data e Hora */}
              <CCol md={6}>
                <CFormLabel htmlFor="dataHora">Data e Horário</CFormLabel>
                <CFormInput
                  type="datetime-local"
                  id="dataHora"
                  value={dataHora}
                  onChange={(e) => setDataHora(e.target.value)}
                  required
                />
              </CCol>

              <CCol xs={12} className="d-flex justify-content-end gap-2 mt-4">
                <CButton color="secondary" variant="outline" onClick={() => navigate('/agendamentos/listar')}>
                  <CIcon icon={cilArrowLeft} className="me-2" /> Cancelar
                </CButton>
                <CButton color="primary" type="submit">
                  <CIcon icon={cilSave} className="me-2" /> Salvar Agendamento
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Modais de Feedback (Sucesso/Erro) */}
      <CModal visible={modalSuccess} onClose={() => navigate('/agendamentos/listar')} alignment="center">
        <CModalHeader className="bg-success text-white"><CModalTitle>Sucesso!</CModalTitle></CModalHeader>
        <CModalBody>Agendamento processado com sucesso.</CModalBody>
        <CModalFooter><CButton color="success" onClick={() => navigate('/agendamentos/listar')}>Ok</CButton></CModalFooter>
      </CModal>
    </CRow>
  )
}

export default AgendamentoForm