import React from 'react';
import { Breadcrumb,
    Tabs,
    Row,
    Col,
    Select,
    Form,
    Menu,
    Avatar,
    Input, 
    Radio, 
    Space,
    List,
    Card} from 'antd'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

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

export const ChartDonut = () => {
  return (
    <>
        <Card  
            className='card-dashboard'
            title="X personas en el grupo"
            style={{
                width: '100%',
            }}>
            <Doughnut data={data} />
        </Card>
    </>
  )
}