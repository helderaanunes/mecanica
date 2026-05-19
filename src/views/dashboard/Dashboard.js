import React, { useEffect, useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow,
  CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
  CBadge
} from '@coreui/react'
import { CChartBar, CChartDoughnut } from '@coreui/react-chartjs'
import MainChart from './MainChart'

const Dashboard = () => {
const [periodoTexto, setPeriodoTexto] = useState('Carregando período...')
  // ==========================================
  // CONFIGURAÇÕES VISUAIS COMPARTILHADAS (UI)
  // ==========================================
  
  const cardStyle = {
    borderRadius: '12px',
    overflow: 'hidden'
  }

  const cardHeaderStyle = {
    backgroundColor: 'transparent',
    fontWeight: '600',
    fontSize: '1.05rem',
    color: '#3c4b64',
    paddingTop: '1.25rem',
    paddingBottom: '0.25rem'
  }

  // Opção padrão para formatação de moeda nos balões (tooltips)
  const currencyTooltipCallback = {
    label: function (context) {
      let value = context.raw || 0;
      return ` Lucro: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    }
  }

  // Opções globais para gráficos de Rosca (Doughnut)
  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: { size: 11, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(28, 28, 28, 0.9)',
        padding: 10,
        cornerRadius: 6,
        callbacks: currencyTooltipCallback
      }
    },
    cutout: '72%',
    maintainAspectRatio: false,
  }

  // ==========================================
  // DADOS DOS COMPONENTES
  // ==========================================

  // 2 - Manutenção por Modelo (Gráfico de Barras Horizontal)
  const maintenanceData = {
    labels: ['Fiat Uno', 'VW Gol', 'Toyota Corolla', 'Honda Civic', 'Chevrolet Onix'],
    datasets: [{
      label: 'Manutenções',
      backgroundColor: 'rgba(54, 162, 235, 0.85)',
      borderRadius: 6,
      barThickness: 16,
      data: [45, 38, 25, 20, 15],
    }],
  }

  const barOptions = {
    indexAxis: 'y', // Inverte o eixo para transformar em barras horizontais (ótimo para ranking)
    plugins: {
      legend: { display: false } // Oculta legenda redundante
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } }
    },
    maintainAspectRatio: false,
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

  // 5 - Top 5 Produtos (Lucro)
  const topProfitProducts = {
    labels: ['Pneus', 'Baterias', 'Amortecedores', 'Óleo Sintético', 'Lâmpadas Led'],
    datasets: [{
      data: [5000, 4200, 3800, 2100, 1500],
      backgroundColor: [
        'rgba(54, 162, 235, 0.85)',
        'rgba(75, 192, 192, 0.85)',
        'rgba(153, 102, 255, 0.85)',
        'rgba(255, 159, 64, 0.85)',
        'rgba(255, 99, 132, 0.85)',
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    }]
  }

  // 6 - Top 5 Serviços (Lucro)
  const topProfitServices = {
    labels: ['Retífica', 'Alinhamento', 'Pintura', 'Revisão Geral', 'Troca de Embreagem'],
    datasets: [{
      data: [8000, 5000, 4500, 4000, 3200],
      backgroundColor: [
        'rgba(46, 184, 92, 0.85)',  // Verde Profissional
        'rgba(51, 153, 255, 0.85)', // Azul
        'rgba(249, 177, 21, 0.85)', // Amarelo/Âmbar
        'rgba(229, 83, 83, 0.85)',  // Vermelho Muted
        'rgba(60, 75, 100, 0.85)',  // Cinza Grafite
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    }]
  }

  return (
    <>
      {/* 1 - Fluxo de Caixa */}
      <CCard className="mb-4 border-0 shadow-sm" style={cardStyle}>
        <CCardHeader className="border-0" style={cardHeaderStyle}>
          Fluxo de Caixa Semanal
          <div className="text-muted" style={{ fontSize: '0.78rem', fontWeight: 'normal' }}>Comparativo de Entradas vs Saídas</div>
          <div className="small text-body-secondary">{periodoTexto}</div>
        </CCardHeader>
        <CCardBody>
          <MainChart setPeriodo={setPeriodoTexto} />
        </CCardBody>
      </CCard>

      <CRow>
        {/* 2 - Manutenção por Modelo */}
        <CCol md={6}>
          <CCard className="mb-4 border-0 shadow-sm" style={cardStyle}>
            <CCardHeader className="border-0" style={cardHeaderStyle}>
              Modelos com Mais Manutenções
              <div className="text-muted" style={{ fontSize: '0.78rem', fontWeight: 'normal' }}>Volume total acumulado</div>
            </CCardHeader>
            <CCardBody style={{ height: '280px', padding: '1.5rem' }}>
              <CChartBar data={maintenanceData} options={barOptions} />
            </CCardBody>
          </CCard>
        </CCol>

        {/* 3 - Tabela Estoque Baixo */}
        <CCol md={6}>
          <CCard className="mb-4 border-0 shadow-sm" style={cardStyle}>
            <CCardHeader className="border-0" style={cardHeaderStyle}>
              Atenção: Estoque Baixo
              <div className="text-muted" style={{ fontSize: '0.78rem', fontWeight: 'normal' }}>Itens abaixo do limite mínimo recomendado</div>
            </CCardHeader>
            <CCardBody style={{ height: '280px', overflowY: 'auto' }}>
              <CTable hover responsive align="middle" className="mb-0">
                <CTableHead className="text-muted" style={{ fontSize: '0.85rem' }}>
                  <CTableRow>
                    <CTableHeaderCell className="border-bottom-0">Produto</CTableHeaderCell>
                    <CTableHeaderCell className="border-bottom-0">Qtd Atual</CTableHeaderCell>
                    <CTableHeaderCell className="border-bottom-0 text-end">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {lowStockProducts.map((prod) => (
                    <CTableRow key={prod.id}>
                      <CTableDataCell style={{ fontWeight: '500' }}>{prod.name}</CTableDataCell>
                      <CTableDataCell>
                        <span className="text-danger" style={{ fontWeight: '600' }}>{prod.stock}</span> 
                        <span className="text-muted" style={{ fontSize: '0.85rem' }}> / min {prod.min}</span>
                      </CTableDataCell>
                      <CTableDataCell className="text-end">
                        <CBadge color="danger" className="px-2 py-15" style={{ borderRadius: '4px' }}>REPOR IMEDIATO</CBadge>
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
          <CCard className="mb-4 border-0 shadow-sm" style={cardStyle}>
            <CCardHeader className="border-0" style={cardHeaderStyle}>
              Aniversariantes da Semana
              <div className="text-muted" style={{ fontSize: '0.78rem', fontWeight: 'normal' }}>Ações de fidelização e contato</div>
            </CCardHeader>
            <CCardBody style={{ height: '340px', overflowY: 'auto' }}>
              <CTable align="middle" className="mb-0">
                <CTableBody>
                  {birthdays.map((c, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell className="ps-0">
                        <div style={{ fontWeight: '500', color: '#3c4b64' }}>{c.name}</div>
                        <small className="text-muted" style={{ fontSize: '0.8rem' }}>🎉 {c.date}</small>
                      </CTableDataCell>
                      <CTableDataCell className="text-end pe-0">
                        <CBadge color="light" className="text-info border border-info-subtle px-2 py-1" style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                          {c.phone}
                        </CBadge>
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
          <CCard className="mb-4 border-0 shadow-sm" style={cardStyle}>
            <CCardHeader className="border-0" style={cardHeaderStyle}>
              Top 5 Produtos (30 dias)
              <div className="text-muted" style={{ fontSize: '0.78rem', fontWeight: 'normal' }}>Maiores margens de lucro líquido</div>
            </CCardHeader>
            <CCardBody style={{ height: '340px', padding: '1rem' }}>
              <CChartDoughnut data={topProfitProducts} options={doughnutOptions} />
            </CCardBody>
          </CCard>
        </CCol>

        {/* 6 - Top 5 Serviços (Lucro) */}
        <CCol md={4}>
          <CCard className="mb-4 border-0 shadow-sm" style={cardStyle}>
            <CCardHeader className="border-0" style={cardHeaderStyle}>
              Top 5 Serviços (30 dias)
              <div className="text-muted" style={{ fontSize: '0.78rem', fontWeight: 'normal' }}>Faturamento por mão de obra</div>
            </CCardHeader>
            <CCardBody style={{ height: '340px', padding: '1rem' }}>
              <CChartDoughnut data={topProfitServices} options={doughnutOptions} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard