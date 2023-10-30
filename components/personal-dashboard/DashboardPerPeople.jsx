import {React, useEffect, useState} from 'react'
import { Row,Col,Card, Avatar, Progress} from 'antd'
import FeelingCalendar from './FeelingCalendar'
import FeelingPieChart from './FeelingPieChart'
import PersonalRecord from './PersonalRecord'
import FilterDashboardPersonal from './FilterDashboardPersonal'
import Calendar from './Calendar'
import ListGroups from './ListGroups'
import { useSelector } from 'react-redux'
import { SmileOutlined, FrownOutlined, PlusCircleOutlined, MinusCircleOutlined  } from "@ant-design/icons";
import SteakPersonal from '../dashboard-ynl/SteakPersonal'
import ProjectsPersonal from '../dashboard-ynl/ProjectsPersonal'
import ChartGoalsPersonal from '../dashboard-ynl/ChartGoalsPersonal'


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
                <div style={{backgroundColor:"#FFFFFF", padding:"16px 8px", borderRadius:"25px"}}>
                    <Row>
                        <Col xs={24} sm={24} md={24} className="aligned-to-center">
                            { reportPerson && reportPerson[0]?.user?.is_happy &&
                                <SmileOutlined style={{color:'green', fontSize:80}} />
                            }
                            { reportPerson && !reportPerson[0]?.user?.is_happy && 
                                <FrownOutlined style={{color:'red',fontSize:80}}/>
                            }
                            <Avatar
                                style={{marginLeft:"16px", marginRight:"16px"}}
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
                            <div style={{display:"block"}}>
                                {reportPerson &&
                                    <h2 style={{color:"#FF5E00", textAlign:"center", marginBottom:"0px"}}>
                                        {(reportPerson[0]?.user?.firstName || reportPerson[0]?.user?.lastName) ?
                                        `${reportPerson[0]?.user?.firstName} ${reportPerson[0]?.user?.lastName}` : reportPerson[0]?.user?.email}
                                    </h2>
                                }
                                <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                                    <div style={{width:"300px", display:"block", marginBottom:"8px"}}>
                                        { reportPerson  &&
                                            <>
                                                <Progress
                                                    strokeColor={!reportPerson[0]?.user?.is_happy ? {
                                                        '0%': '#c10f0f',
                                                        '40%': '#c10f0f',
                                                    } : {
                                                        '0%': '#50c10f',
                                                        '60%': '#50c10f',
                                                    }}
                                                    percent={Math.round(Number(reportPerson[0]?.user?.percent))} 
                                                />
                                                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                                                    <MinusCircleOutlined style={{fontSize:"20px"}} />
                                                    <PlusCircleOutlined style={{fontSize:"20px", paddingRight:"36px"}}/>
                                                </div>
                                            </>                   
                                        }
                                    </div>
                                </div>
                            </div>
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
            <Col xs={24} sm={24} md={12} className='item-dashboard'>
                <SteakPersonal />
            </Col>
            <Col xs={24} sm={24} md={12} className='item-dashboard'>
                <ChartGoalsPersonal />
            </Col>
            <Col xs={24} sm={24} md={12} className='item-dashboard'>
                <ProjectsPersonal />
            </Col>
        </Row>     
    </>    
  )
}