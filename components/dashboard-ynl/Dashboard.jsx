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
