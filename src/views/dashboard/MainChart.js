import React, { useEffect, useState } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import axios from 'axios'

const MainChart = ({ setPeriodo }) => {
  const [dadosFluxo, setDadosFluxo] = useState([])

  // Função auxiliar para formatar YYYY-MM-DD para DD/MM/AAAA
  const formatarDataBR = (dataString) => {
    if (!dataString) return ''
    const [ano, mes, dia] = dataString.split('-')
    return `${dia}/${mes}/${ano}`
  }

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/lancamentos/fluxo-semanal')
        const dados = response.data
        setDadosFluxo(dados)

        // Atualiza o texto do intervalo no Dashboard pai
        if (dados.length > 0 && setPeriodo) {
          const inicio = formatarDataBR(dados[0].data)
          const fim = formatarDataBR(dados[dados.length - 1].data)
          setPeriodo(`${inicio} - ${fim}`)
        }
      } catch (error) {
        console.error('Erro ao carregar dados do gráfico:', error)
        if (setPeriodo) setPeriodo('Erro ao carregar período')
      }
    }

    buscarDados()
  }, [setPeriodo])

  return (
    <CChartLine
      style={{ height: '300px', marginTop: '40px' }}
      data={{
        // Labels formatados para BR no eixo X
        labels: dadosFluxo.map((d) => formatarDataBR(d.data)),
        datasets: [
          {
            label: 'Entradas',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-success'),
            pointHoverBackgroundColor: getStyle('--cui-success'),
            borderWidth: 2,
            data: dadosFluxo.map((d) => d.totalEntrada),
            fill: true,
          },
          {
            label: 'Saídas',
            backgroundColor: 'transparent',
            borderColor: getStyle('--cui-danger'),
            pointHoverBackgroundColor: getStyle('--cui-danger'),
            borderWidth: 2,
            data: dadosFluxo.map((d) => d.totalSaida),
          },
        ],
      }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              drawOnChartArea: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              // Formata os valores do eixo Y para moeda (opcional)
              callback: function (value) {
                return 'R$ ' + value.toLocaleString('pt-BR')
              },
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 2,
            hitRadius: 10,
            hoverRadius: 4,
          },
        },
      }}
    />
  )
}

export default MainChart