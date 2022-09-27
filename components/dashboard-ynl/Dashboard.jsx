import {React, useEffect, useState} from 'react';
import { Row,Col,} from 'antd';
import ChartDonut from './ChartDonut';
import SurveyStatisticsChart from './SurveyStatisticsChart';
import  GroupEmotionsPerDayChart  from './GroupEmotionsPerDayChart';
import UseOfYnl from './UseOfYnl';
import { connect } from 'react-redux';
import moment from 'moment';

export const Dashboard = ({stadistics, ...props}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [feeling, setFeeling] = useState("");
  const [colorFeeling, setColorFeeling] = useState("FF5E00");

  useEffect(() => {
    console.log("aqui el resumen",stadistics)
    setStartDate(stadistics.start_date);
    setEndDate(stadistics.end_date);
    if(stadistics?.feeling?.count > 0){
        setFeeling(stadistics?.feeling?.name);
        setColorFeeling(stadistics?.feeling?.color)
    }else{
        setFeeling("No se registraron emociones");
        setColorFeeling("FF5E00")
    }
  }, [stadistics]);
  return (
    <>
        <Row gutter={[16,8]} className='container-dashboard'>
            <Col span={24}>
                <div style={{backgroundColor:"#FF5E00", padding:"16px 8px", borderRadius:"25px"}}>
                    <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>Aquí tienes un resumen de las emociones del personal de la empresa</h2>
                </div>
            </Col>
            <Col span={24}>
                <div style={{backgroundColor: `#${colorFeeling}`, padding:"16px 8px", borderRadius:"25px"}}>
                    <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>La emoción más fuerte del personal en el periodo del {startDate} al {endDate} fue: {feeling}</h2>
                </div>
            </Col>
        </Row>
        <Row gutter={[16,24]} className='container-dashboard'>
            <Col xs={24} sm={24} md={10}  className='item-dashboard'>
                <ChartDonut />
            </Col>
            <Col xs={24} sm={24} md={14}  className='item-dashboard'>
                <GroupEmotionsPerDayChart />
            </Col>
            <Col xs={24} sm={24} md={10} className='item-dashboard'>
                <UseOfYnl />
            </Col>
            <Col xs={24} sm={24} md={14}  className='item-dashboard'>
                <SurveyStatisticsChart />
            </Col>
        </Row>     
    </>    
  )
}

const mapState = (state) =>{
    return {
        stadistics: state.ynlStore.stadistics
    }
}
export default connect(mapState)(Dashboard);
