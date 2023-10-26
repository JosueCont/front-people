import {React, useEffect, useState} from 'react'
import { Card, Empty} from 'antd'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { connect } from "react-redux";
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, Tooltip, Legend);

const FeelingPieChart = ({reportPerson,...props}) => {
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
  const [isEmpty, setIsEmpty] = useState(false);
  const [totalEmotions, setTotalEmotions] = useState("Total de emociones registradas");
  const [configOptions, setConfigOptions] = useState({
    maintainAspectRatio: false,
    plugins: {
      legend: {
        onClick: null
      },
      datalabels: {},
    }
  });
  useEffect(() => {
    //console.log("reporte personal",reportPerson?.data?.at(-1).global);
    let globalData = reportPerson?.data?.at(-1).global;
    if(globalData){
      let labelsResults = [];
      let dataResults = [];
      let colorsResults = [];
      globalData.map((item)=>{
        labelsResults.push(item.name);
        dataResults.push(item.count || 0);
        colorsResults.push(`#${item.color}`);
      })
      console.log('data results',dataResults)
      let total = dataResults.reduce((a, b) => a + b, 0);
      total != 0 ? setIsEmpty(false) : setIsEmpty(true);
      setTotalEmotions("Total de emociones registradas: " + total); 
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
      let options = {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            onClick: null
          },
          datalabels: {
            formatter: (value, ctx) => {
              if(value != 0 ){
                let sum = 0;
                dataResults.map(data => {
                    sum += data;
                });
                let percentage = (value * 100 / sum).toFixed(2) + "%" ;
                return percentage;
              }else{
                value = "";
                return value;
              }
            },
            color: '#ffffff',
          },
          
        }
      }
      setConfig(obj)
      setConfigOptions(options)
    }
  }, [reportPerson]);
  return (
    <>
        <Card  
            className='card-dashboard'
            title={totalEmotions}
            style={{
                width: '100%',
            }}>
              { !isEmpty && (
                <Pie data={config} width="350px" height="350px" plugins={[ChartDataLabels]} options={configOptions} />
              )}
              { isEmpty && (
                <div className='aligned-to-center'>
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    description={
                      <span>
                        <b>No se registraron emociones</b>
                      </span>
                    } 
                  />
                </div>
              )}
             
        </Card>
    </>
  )
}

const mapState = (state) => {
  return {
    persons: state.ynlStore.persons,
    reportPerson: state.ynlStore.reportPerson,
  };
};

export default connect(mapState)(FeelingPieChart);