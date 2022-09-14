import React from 'react'
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
import {
        Chart as ChartJS,
        LinearScale,
        CategoryScale,
        BarElement,
        PointElement,
        LineElement,
        Legend,
        Tooltip,
        LineController,
        BarController,
      } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
);
const labels = ['January', 'February', 'March', 'April',];
export const data = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Dataset 1',
        borderColor: 'rgb(255, 251, 0)',
        borderWidth: 2,
        fill: false,
        data: labels.map(() => faker.datatype.number({ min: 0, max: 10 })),
      },
      {
        type: 'bar',
        label: 'Dataset 2',
        backgroundColor: 'rgb(255, 136, 0)',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 8 })),
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

export const SurveyStatisticsChart = () => {
  return (
    <>
        <Card  
            className='card-dashboard'
            title="Estadística de encuestas"
            style={{
                width: '100%',
            }}>
            <Chart type='bar' data={data} />
        </Card>
    </>
  )
}
