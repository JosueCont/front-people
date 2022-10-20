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
    {name:"En paz", img: "https://app-ynl.s3.us-west-1.amazonaws.com/EN_PAZ_37e8cbf4f5.gif"},
    {name:"Confundido", img: "https://app-ynl.s3.us-west-1.amazonaws.com/CONFUNDIDO_afa63010f8.gif"},
    {name:"Abierto", img: "https://app-ynl.s3.us-west-1.amazonaws.com/ABIERTO_b9ddd3fb91.gif"},
    {name:"Inspirado", img: "https://app-ynl.s3.us-west-1.amazonaws.com/INSPIRADO_9a57df9be1.gif"},
    {name:"Contento", img: "https://app-ynl.s3.us-west-1.amazonaws.com/CONTENTO_ec67fc5824.gif"},
    {name:"Deprimido", img: "https://app-ynl.s3.us-west-1.amazonaws.com/DEPRIMIDO_7e1ed099bb.gif"},
    {name:"Molesto", img: "https://app-ynl.s3.us-west-1.amazonaws.com/MOLESTO_sin_salto_min_9fef308c6f.gif"},
  ]

  useEffect(() => {
    console.log("aqui el resumen",stadistics)
    setStartDate(stadistics.start_date);
    setEndDate(stadistics.end_date);
    if(stadistics?.feeling?.count > 0){
        setFeeling(stadistics?.feeling?.name);
        let resultados = emotionsGif.filter(item => item.name == stadistics?.feeling?.name);
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
