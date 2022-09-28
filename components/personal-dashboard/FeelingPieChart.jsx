import {React, useEffect, useState} from 'react'
import { Card} from 'antd'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Inspirado', 'Abierto', 'Confundido', 'Deprimido', 'Contento', 'En paz'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        '#ff0037',
        '#0099ff',
        'rgb(255, 183, 0)',
        '#00ffff',
        '#5a08ff',
        '#ff8000',
      ],
      borderColor: [
        '#ff0037',
        '#0099ff',
        'rgb(255, 183, 0)',
        '#00ffff',
        '#5a08ff',
        '#ff8000',
      ],
      borderWidth: 1,
    },
  ],
};

const FeelingPieChart = () => {
  return (
    <>
        <Card  
            className='card-dashboard'
            title="Registros por emoción"
            style={{
                width: '100%',
            }}>
            <Pie data={data} width="300px" height="300px" options={{maintainAspectRatio: false}} /> 
        </Card>
    </>
  )
}

export default FeelingPieChart