import {React, useEffect, useState} from 'react';
import { Breadcrumb,
    Card, Row, Col, Spin, Empty} from 'antd'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { connect } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartDonut = ({ynlStore, ...props}) => {
  let colors = [
    "#1a85ff",
    "#ff457d",
    "#2fdaff",
    "#ffc700",
    "#ff5e00",
    "#ff1111",
    "#9c4fff"
  ]
  let data = {
    labels: [],
    datasets: [],
  };
  const [config, setConfig] = useState(data);
  const [totalPeople, setTotalPeople] = useState("Personas en el grupo");
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        onClick: null
      },
    }
  }
  useEffect(() => {
    if(ynlStore.length > 0){
      let labelsResults = []
      let dataResults = []
      let colorsResults = []
      ynlStore.map((item) =>{
        labelsResults.push(item.name)
        dataResults.push(item.count || 0)
        colorsResults.push(`#${item.color}`)
      })
      let total = dataResults.reduce((a, b) => a + b, 0);
      total != 0 ? setIsEmpty(false) : setIsEmpty(true);
      setTotalPeople(total == 1 ? total + " emoción registrada" : total + " emociones registradas"); 
      let obj = {
        labels: labelsResults,
        datasets: [
          {
            label: 'emoción',
            data: dataResults,
            backgroundColor: colorsResults,
            borderColor: colorsResults,
            borderWidth: 1,
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
          title={totalPeople}
          style={{
              width: '100%',
          }}>
            { !isEmpty && (
              <Doughnut data={config} width="400px" height="400px" options={options} /> 
            )}
            { isEmpty && (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={
                  <span>
                    <b>No se registraron emociones</b>
                  </span>
                } 
              />
            )}
      </Card>
    </>
  )
}

const mapState = (state) =>{
  return {
    ynlStore: state.ynlStore.emotionChart,
  };
}

export default connect(mapState)(ChartDonut);