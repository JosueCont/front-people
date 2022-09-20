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
            <Col lg={9} xs={24} className='item-dashboard'>
                <ChartDonut />
            </Col>
            <Col lg={15} xs={24} className='item-dashboard'>
                <GroupEmotionsPerDayChart />
            </Col>
            <Col lg={9} xs={24} className='item-dashboard'>
                <UseOfYnl />
            </Col>
            <Col lg={15} xs={24} className='item-dashboard'>
                <SurveyStatisticsChart />
            </Col>
        </Row>     
    </>    
  )
}
