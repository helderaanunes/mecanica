import React from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
  CBadge
} from '@coreui/react'
import { CChartBar, CChartPie, CChartDoughnut } from '@coreui/react-chartjs'
import MainChart from './MainChart'

const Dashboard = () => {

  // 2 - Dados: Manutenção por Modelo de Carro
  const maintenanceData = {
    labels: ['Fiat Uno', 'VW Gol', 'Toyota Corolla', 'Honda Civic', 'Chevrolet Onix'],
    datasets: [{
      label: 'Manutenções',
      backgroundColor: '#36A2EB',
      data: [45, 38, 25, 20, 15],
    }],
  }

  // 3 - Dados: Estoque Baixo
  const lowStockProducts = [
    { id: 1, name: 'Óleo 5W30', stock: 3, min: 10 },
    { id: 2, name: 'Filtro de Ar', stock: 1, min: 5 },
    { id: 3, name: 'Pastilha de Freio', stock: 2, min: 8 },
  ]

  // 4 - Dados: Aniversariantes
  const birthdays = [
    { name: 'João Silva', date: '15/05', phone: '(11) 9999-8888' },
    { name: 'Maria Oliveira', date: '17/05', phone: '(11) 7777-6666' },
  ]

  // 5 e 6 - Lucro (Produtos e Serviços)
  const topProfitProducts = {
    labels: ['Pneus', 'Baterias', 'Amortecedores', 'Óleo Sintético', 'Lâmpadas Led'],
    datasets: [{
      data: [5000, 4200, 3800, 2100, 1500],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    }]
  }

  const topProfitServices = {
    labels: ['Retífica', 'Alinhamento', 'Pintura', 'Revisão Geral', 'Troca de Embreagem'],
    datasets: [{
      data: [8000, 5000, 4500, 4000, 3200],
      backgroundColor: ['#2eb85c', '#3399ff', '#f9b115', '#e55353', '#3c4b64'],
    }]
  }

  return (
    <>
      {/* 1 - Fluxo de Caixa (Usando o MainChart ajustado) */}
      <CCard className="mb-4">
        <CCardHeader>Fluxo de Caixa Semanal (Entradas vs Saídas)</CCardHeader>
        <CCardBody>
          <MainChart />
        </CCardBody>
      </CCard>

      <CRow>
        {/* 2 - Manutenção por Modelo */}
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>Modelos com Mais Manutenções</CCardHeader>
            <CCardBody>
              <CChartBar data={maintenanceData} labels="modelos" />
            </CCardBody>
          </CCard>
        </CCol>

        {/* 3 - Tabela Estoque Baixo */}
        <CCol md={6}>
          <CCard className="mb-4">
            <CCardHeader>Atenção: Estoque Baixo</CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Produto</CTableHeaderCell>
                    <CTableHeaderCell>Qtd Atual</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {lowStockProducts.map((prod) => (
                    <CTableRow key={prod.id}>
                      <CTableDataCell>{prod.name}</CTableDataCell>
                      <CTableDataCell>{prod.stock} un</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="danger">Repor</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* 4 - Aniversariantes */}
        <CCol md={4}>
          <CCard className="mb-4">
            <CCardHeader>Aniversariantes da Semana</CCardHeader>
            <CCardBody>
              <CTable align="middle">
                <CTableBody>
                  {birthdays.map((c, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>
                        <strong>{c.name}</strong><br/>
                        <small className="text-muted">{c.date}</small>
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        <CBadge color="info" shape="pill">{c.phone}</CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        {/* 5 - Top 5 Produtos (Lucro) */}
        <CCol md={4}>
          <CCard className="mb-4">
            <CCardHeader>Top 5 Produtos (30 dias)</CCardHeader>
            <CCardBody>
              <CChartPie data={topProfitProducts} />
            </CCardBody>
          </CCard>
        </CCol>

        {/* 6 - Top 5 Serviços (Lucro) */}
        <CCol md={4}>
          <CCard className="mb-4">
            <CCardHeader>Top 5 Serviços (30 dias)</CCardHeader>
            <CCardBody>
              <CChartDoughnut data={topProfitServices} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard