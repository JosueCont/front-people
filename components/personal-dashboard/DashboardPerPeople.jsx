import {React, useEffect, useState} from 'react'
import { Row,Col,Card, Avatar, Calendar} from 'antd'
import FeelingCalendar from './FeelingCalendar'
import FeelingPieChart from './FeelingPieChart'
import PersonalRecord from './PersonalRecord'
import FilterDashboardPersonal from './FilterDashboardPersonal'
import ListGroups from './ListGroups'


export const DashboardPerPeople = () => {
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
                            <h2 style={{color:"white", textAlign:"left", marginBottom:"0px", marginLeft:"16px"}}>Nombre del usuario</h2>
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
                <FeelingCalendar/>
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