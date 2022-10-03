import {React, useEffect, useState} from 'react'
import { Card} from 'antd'
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
import { connect } from 'react-redux';

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

const SurveyStatisticsChart = ({ynlStore,...props}) => {
  let data = {
    labels: [],
    datasets: [],
  };
  const [config, setConfig] = useState(data);
  const options = {
    plugins: {
      legend: {
          display: false,
          labels: {
              color: 'rgb(255, 99, 132)'
          }
      }
    }
  }
  useEffect(() => {
    if(ynlStore){
      let labelsFinish = []
      let labelsResults = []
      let dataResults = []
      Object.entries(ynlStore).map(([key,item]) =>{
        //Armamos array de etiquetas pero quitandoles los caracteres especiales
        labelsResults.push(key.replace(/(\w+)_(\w+)/g, (_, [a, ...b], [c, ...d]) => 
          `${a}${b.join('').toLowerCase()} ${c}${d.join('').toLowerCase()}`
          ).trim());
        dataResults.push(item);
      })
      //Armamos array final para darle formato al texto
      labelsFinish = labelsResults.map((item) => {
        return item.charAt(0).toUpperCase() + item.slice(1);
      });
      let obj = {
        labels: labelsFinish,
        datasets: [
          {
            type: 'bar',
            label: 'Promedio',
            backgroundColor: '#FF5E00',
            data: dataResults,
            borderColor: 'white',
            borderWidth: 2,
          },
        ],
      };
      setConfig(obj)
    }
  }, [ynlStore]);
  return (
    <>
        <Card  
            className='card-dashboard'
            title="Aspectos del usuario"
            style={{
                width: '100%',
            }}>
            <Chart type='bar' data={config} options={options} />
        </Card>
    </>
  )
}

const mapState = (state) =>{
  return{
    ynlStore: state.ynlStore.emotionalAspects,
  };
}
export default connect(mapState)(SurveyStatisticsChart);