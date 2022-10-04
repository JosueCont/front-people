import {React, useEffect, useState} from 'react'
import { Row,Col,Card, Avatar} from 'antd'
import FeelingCalendar from './FeelingCalendar'
import FeelingPieChart from './FeelingPieChart'
import PersonalRecord from './PersonalRecord'
import FilterDashboardPersonal from './FilterDashboardPersonal'
import Calendar from './Calendar'
import ListGroups from './ListGroups'
import { useSelector } from 'react-redux'


export const DashboardPerPeople = () => {
  const reportPerson = useSelector((state) => state?.ynlStore?.reportPerson?.data)

  return (
    <>
        <Row gutter={[16,24]} className='container-dashboard'>
            <Col xs={24} sm={24} md={24} >
                <FilterDashboardPersonal/> 
            </Col>
        </Row>
        <Row gutter={[16,8]} className='container-dashboard'>
            <Col xs={24} sm={24} md={24}>
                <div style={{backgroundColor:"#FF5E00", padding:"16px 8px", borderRadius:"25px"}}>
                    <Row>
                        <Col xs={24} sm={24} md={24} className="aligned-to-center">
                            <Avatar
                                style={{marginLeft:"16px"}}
                                size={{
                                xs: 80,
                                sm: 80,
                                md: 80,
                                lg: 80,
                                xl: 80,
                                xxl: 80,
                                }}
                                src="/images/LogoYnl.png"
                            />
                            <h2 style={{color:"white", textAlign:"left", marginBottom:"0px", marginLeft:"16px"}}>{reportPerson && reportPerson[0]?.user?.firstName} {reportPerson && reportPerson[0]?.user?.lastName}</h2>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
        <Row gutter={[16,24]} className='container-dashboard'>
            <Col xs={24} sm={24} md={12} className='item-dashboard'>
               <FeelingPieChart/>
            </Col>
            <Col xs={24} sm={24} md={12} className='item-dashboard'>
                {/* <Calendar/> */}
                <FeelingCalendar />
            </Col>
            <Col xs={24} sm={24} md={12} className='item-dashboard'>
                <PersonalRecord/>
            </Col>
            <Col xs={24} sm={24} md={12} className='item-dashboard'>
                <ListGroups/>
            </Col>
        </Row>     
    </>    
  )
}