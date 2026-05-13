import React, { useEffect, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = () => {
  const chartRef = useRef(null)

  // Cores dinâmicas do CoreUI
  const colorIn = getStyle('--cui-success') || '#2eb85c'
  const colorOut = getStyle('--cui-danger') || '#e55353'

  const data = {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Entradas',
        backgroundColor: 'transparent',
        borderColor: colorIn,
        pointHoverBackgroundColor: colorIn,
        borderWidth: 3,
        data: [1200, 1900, 800, 1500, 2100, 1100, 600],
        tension: 0.4,
      },
      {
        label: 'Saídas',
        backgroundColor: 'transparent',
        borderColor: colorOut,
        pointHoverBackgroundColor: colorOut,
        borderWidth: 3,
        borderDash: [5, 5], // Linha tracejada para diferenciar
        data: [800, 1200, 900, 700, 1500, 400, 300],
        tension: 0.4,
      },
    ],
  }

  return (
    <CChartLine
      ref={chartRef}
      style={{ height: '300px', marginTop: '40px' }}
      data={data}
      options={{
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true }
        }
      }}
    />
  )
}

export default MainChart