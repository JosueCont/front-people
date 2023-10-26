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
  const [emotion, setEmotion] = useState("");
  const emotionsGif = [
    {name:"Amor", img: "https://app-ynl.s3.us-west-1.amazonaws.com/loved_795741adb9.gif"},
    {name:"Miedo", img: "https://app-ynl.s3.us-west-1.amazonaws.com/worry_86886646e9.gif"},
    {name:"Sorpresa", img: "https://app-ynl.s3.us-west-1.amazonaws.com/surprised_d64380ac63.gif"},
    {name:"Asco", img: "https://app-ynl.s3.us-west-1.amazonaws.com/disgusting_161da17b38.gif"},
    {name:"Alegría", img: "https://app-ynl.s3.us-west-1.amazonaws.com/happy_92a28b2871.gif"},
    {name:"Tristeza", img: "https://app-ynl.s3.us-west-1.amazonaws.com/sad_bbf8c1d118.gif"},
    {name:"Ira", img: "https://app-ynl.s3.us-west-1.amazonaws.com/angry_1c3023842e.gif"},
]
  useEffect(() => {
    setStartDate(stadistics.start_date);
    console.log('estadisticas',stadistics)
    setEndDate(stadistics.end_date);
    if(stadistics?.feeling?.count > 0){
        setFeeling(stadistics?.feeling?.name);
        let resultados = emotionsGif.filter(item => item.name == stadistics?.feeling?.name);
        console.log('resultados',resultados,stadistics)
        setEmotion(resultados.at(-1).img);
        setColorFeeling(stadistics?.feeling?.color)
    }else{
        setFeeling("No se registraron emociones");
        setColorFeeling("FF5E00")
        setEmotion("");
    }
  }, [stadistics]);
  return (
    <>
        <Row gutter={[16,8]} className='container-dashboard' justify='center'>
            {/* <Col span={24}>
                <div style={{backgroundColor:"#FF5E00", padding:"16px 8px", borderRadius:"25px"}}>
                    <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>Aquí tienes un resumen de las emociones del personal de la empresa</h2>
                </div>
            </Col>
            <Col span={24}>
                <div style={{backgroundColor: `#${colorFeeling}`, padding:"16px 8px", borderRadius:"25px"}}>
                    <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>La emoción mas frecuente del periodo seleccionado es: {feeling}</h2>
                </div>
            </Col> */}
            <Col span={24}>
                    <h2 style={{color:"black", textAlign:"center", marginBottom:"0px"}}>Resumen de emociones del personal</h2>
            </Col>
            <Col span={13}>
                <div style={{backgroundColor: `#${colorFeeling}`, padding:"8px 8px", borderRadius:"15px", boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}>
                    <p style={{color:"white", textAlign:"center", marginBottom:"0px", fontSize:"15px"}}>Emoción más frecuente del periodo seleccionado</p>
                    <div className='aligned-to-center'>
                        <Row justify='center'>
                            { emotion != "" &&
                                <Col xs={24} sm={24} md={6} className='aligned-to-center'>
                                    <img src={emotion} alt="" width={60} style={{margin:"0px 8px"}} />
                                </Col> 
                            }
                            <Col xs={24} sm={24} md={18} className='aligned-to-center'>
                                <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}><b>{feeling}</b></h2>
                            </Col>
                        </Row>
                        {/* { emotion != "" &&
                            <img src={emotion} alt="" width={60} />
                        }
                        <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}><b>{feeling}</b></h2> */}
                    </div>
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
