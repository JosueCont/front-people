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
  useEffect(() => {
    if(ynlStore){
      let labelsResults = []
      let dataResults = []
      Object.entries(ynlStore).map(([key,item]) =>{
        labelsResults.push(key)
        dataResults.push(item)
      })
      
      let obj = {
        labels: labelsResults,
        datasets: [
          {
            type: 'bar',
            label: 'Encuestas',
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
            title="Estadística de encuestas"
            style={{
                width: '100%',
            }}>
            <Chart type='bar' data={config} />
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