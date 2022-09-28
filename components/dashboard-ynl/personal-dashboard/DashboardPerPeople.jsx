import {React, useEffect, useState} from 'react'
import { Row,Col,Card, Avatar, Calendar} from 'antd'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import moment from 'moment';

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

export const DashboardPerPeople = () => {
  const [value, setValue] = useState(moment('2017-01-25'));
  const [selectedValue, setSelectedValue] = useState(moment('2017-01-25'));

  const onSelect = (newValue) => {
    setValue(newValue);
    setSelectedValue(newValue);
  };

  const onPanelChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <>
        <Row gutter={[16,24]} className='container-dashboard'>
            <Col xs={24} sm={24} md={8}  className='item-dashboard'>
                <Card  
                    className='card-dashboard'
                    title="Información del perfil"
                    style={{
                        width: '100%',
                    }}>
                        <div className='flex-item'>
                            <div>
                                <Avatar
                                    size={{
                                    xs: 100,
                                    sm: 100,
                                    md: 100,
                                    lg: 100,
                                    xl: 100,
                                    xxl: 100,
                                    }}
                                    src="/images/LogoYnl.png"
                                    style={{marginBottom:16}}
                                />
                                <div className='data-subtitle'>
                                    <h2 className='subtitles' style={{textTransform:"capitalize"}}><b>Nombre e información del usuario</b></h2>
                                </div> 
                            </div>
                        </div>  
                </Card>
            </Col>
            <Col xs={24} sm={24} md={16}  className='item-dashboard'>
                <Card  
                    className='card-dashboard'
                    title="Registros por emoción"
                    style={{
                        width: '100%',
                    }}>
                    <Doughnut data={data} width={5} height={5} /> 
                </Card>
            </Col>
            <Col xs={24} sm={24} md={8} className='item-dashboard'>
                <Card  
                    className='card-dashboard'
                    title="Mi historial"
                    style={{
                        width: '100%',
                    }}>
                    <Row gutter={[16,8]} className='container-dashboard'>
                        <Col span={24}>
                            <div style={{backgroundColor:"#FF5E00", padding:"16px 8px", borderRadius:"25px"}}>
                                <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>Confundido</h2>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div style={{backgroundColor: "#0099ff", padding:"16px 8px", borderRadius:"25px"}}>
                                <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>Calmado</h2>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div style={{backgroundColor:"#FF5E00", padding:"16px 8px", borderRadius:"25px"}}>
                                <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>Confundido</h2>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div style={{backgroundColor: "#0099ff", padding:"16px 8px", borderRadius:"25px"}}>
                                <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>Calmado</h2>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div style={{backgroundColor:"#5a08ff", padding:"16px 8px", borderRadius:"25px"}}>
                                <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>Deprimido</h2>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div style={{backgroundColor: "#ff0037", padding:"16px 8px", borderRadius:"25px"}}>
                                <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>Molesto</h2>
                            </div>
                        </Col>
                    </Row>    
                </Card>
            </Col>
            <Col xs={24} sm={24} md={16}  className='item-dashboard'>
                <Card  
                    className='card-dashboard'
                    title="Emoción registrada por día"
                    style={{
                        width: '100%',
                    }}>
                    <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} />    
                </Card>
            </Col>
        </Row>     
    </>    
  )
}