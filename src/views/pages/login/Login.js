import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert, // Importa o componente de alerta para exibir erros
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  const { login } = useAuth() // Desestrutura a função login do contexto
  const navigate = useNavigate() // Hook para redirecionamento de páginas

  // 2. Estados para armazenar os dados do formulário e mensagens de erro
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  // 3. Função que intercepta o envio do formulário
  const handleLogin = async (e) => {
    e.preventDefault() // Evita o recarregamento padrão da página
    setErro('')
    setCarregando(true)

    try {
      // Passa os dados exatamente como o DadosAutenticacao.java do Spring espera
      const sucesso = await login(email, senha)
      if (sucesso) {
        navigate('/') // Redireciona para a raiz do seu painel protegido (DefaultLayout)
      }
    } catch (err) {
      // Trata o erro caso a senha esteja errada ou o servidor esteja offline
      if (err.response && err.response.status === 403) {
        setErro('E-mail ou senha incorretos.')
      } else {
        setErro('Não foi possível conectar ao servidor. Tente mais tarde.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  {/* 4. Adiciona o evento de submit no Form */}
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Entre na sua conta</p>
                    {erro && <CAlert color="danger">{erro}</CAlert>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        type="email"
                        placeholder="E-mail" 
                        autoComplete="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Senha"
                        autoComplete="current-password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        {/* Define o botão como type="submit" para submeter o formulário */}
                        <CButton type="submit" color="primary" className="px-4" disabled={carregando}>
                          {carregando ? 'Entrando...' : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Esqueceu a senha?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Cadastre-se</h2>
                    <p>
                      Crie sua conta no sistema de gerenciamento da mecânica para gerenciar
                      suas marcas, veículos e ordens de serviço.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Registrar Agora!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login