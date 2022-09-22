import {React, useEffect, useState} from 'react'
import { Row,Col,} from 'antd'
import ChartDonut from './ChartDonut'
import SurveyStatisticsChart from './SurveyStatisticsChart'
import  GroupEmotionsPerDayChart  from './GroupEmotionsPerDayChart'
import UseOfYnl from './UseOfYnl'

export const Dashboard = () => {
  return (
    <>
        <Row gutter={[16,24]} className='container-dashboard'>
            <Col span={24}>
                <div style={{backgroundColor:"#FF5E00", padding:"16px 8px", borderRadius:"25px"}}>
                    <h2 style={{color:"white", textAlign:"center", marginBottom:"0px"}}>Aquí tienes un resumen de las emociones del personal de la empresa</h2>
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
