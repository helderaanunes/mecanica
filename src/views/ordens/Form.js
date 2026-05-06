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
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle, cilSave, cilArrowLeft } from '@coreui/icons'

const OrdemForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [dataHora, setDataHora] = useState('')
  const [valorTotal, setValorTotal] = useState(0)
  const [desconto, setDesconto] = useState(0)
  const [valorLiquido, setValorLiquido] = useState(0)

  const [veiculos, setVeiculos] = useState([])
  const [usuarios, setUsuarios] = useState([])

  const [veiculoId, setVeiculoId] = useState('')
  const [usuarioId, setUsuarioId] = useState('')

  const [validated, setValidated] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 🔹 Calcular valor líquido automaticamente
  useEffect(() => {
    setValorLiquido(valorTotal - desconto)
  }, [valorTotal, desconto])

  // 🔹 Carregar dados auxiliares
  useEffect(() => {
    axios.get('http://localhost:8080/veiculos')
      .then(res => setVeiculos(res.data))

    axios.get('http://localhost:8080/usuarios')
      .then(res => setUsuarios(res.data))
  }, [])

  // 🔹 Se for edição, carregar ordem
  useEffect(() => {
    if (isEdit) {
      axios.get(`http://localhost:8080/ordens/${id}`)
        .then(res => {
          const o = res.data
          setDataHora(o.dataHora?.slice(0,16))
          setValorTotal(o.valorTotal)
          setDesconto(o.desconto)
          setValorLiquido(o.valorLiquido)
          setVeiculoId(o.veiculo?.id)
          setUsuarioId(o.usuario?.id)
        })
        .catch(() => {
          setErrorMessage('Erro ao carregar ordem.')
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
      dataHora,
      valorTotal,
      desconto,
      valorLiquido,
      veiculo: { id: veiculoId },
      usuario: { id: usuarioId }
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:8080/ordens/${id}`, payload)
      } else {
        await axios.post('http://localhost:8080/ordens', payload)
      }

      setModalSuccess(true)
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao salvar ordem.'
      setErrorMessage(msg)
      setModalError(true)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader className="bg-dark text-white">
            <strong>{isEdit ? 'Editar Ordem' : 'Nova Ordem de Serviço'}</strong>
          </CCardHeader>

          <CCardBody>
            <CForm noValidate validated={validated} onSubmit={handleSubmit}>
              <CRow className="g-3">

                <CCol md={6}>
                  <CFormLabel>Data/Hora</CFormLabel>
                  <CFormInput
                    type="datetime-local"
                    value={dataHora}
                    onChange={e => setDataHora(e.target.value)}
                    required
                  />
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Veículo</CFormLabel>
                  <CFormSelect
                    value={veiculoId}
                    onChange={e => setVeiculoId(e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    {veiculos.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.placa}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormLabel>Usuário</CFormLabel>
                  <CFormSelect
                    value={usuarioId}
                    onChange={e => setUsuarioId(e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={4}>
                  <CFormLabel>Valor Total</CFormLabel>
                  <CFormInput
                    type="number"
                    value={valorTotal}
                    onChange={e => setValorTotal(parseFloat(e.target.value))}
                    required
                  />
                </CCol>

                <CCol md={4}>
                  <CFormLabel>Desconto</CFormLabel>
                  <CFormInput
                    type="number"
                    value={desconto}
                    onChange={e => setDesconto(parseFloat(e.target.value))}
                  />
                </CCol>

                <CCol md={4}>
                  <CFormLabel>Valor Líquido</CFormLabel>
                  <CFormInput
                    type="number"
                    value={valorLiquido}
                    readOnly
                  />
                </CCol>

                <CCol xs={12} className="d-flex justify-content-end gap-2 mt-4">
                  <CButton color="secondary" variant="outline" onClick={() => navigate('/ordens/listar')}>
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    Cancelar
                  </CButton>

                  <CButton color="primary" type="submit">
                    <CIcon icon={cilSave} className="me-2" />
                    {isEdit ? 'Salvar Alterações' : 'Salvar Ordem'}
                  </CButton>
                </CCol>

              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* SUCESSO */}
      <CModal visible={modalSuccess} onClose={() => navigate('/ordens/listar')} alignment="center">
        <CModalHeader className="bg-success text-white">
          <CModalTitle>
            <CIcon icon={cilCheckCircle} className="me-2" />
            Sucesso
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          Ordem salva com sucesso!
        </CModalBody>
        <CModalFooter>
          <CButton color="success" onClick={() => navigate('/ordens/listar')}>
            OK
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ERRO */}
      <CModal visible={modalError} onClose={() => setModalError(false)} alignment="center">
        <CModalHeader className="bg-danger text-white">
          <CModalTitle>
            <CIcon icon={cilXCircle} className="me-2" />
            Erro
          </CModalTitle>
        </CModalHeader>
        <CModalBody>{errorMessage}</CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setModalError(false)}>
            Fechar
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default OrdemForm