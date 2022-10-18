import {React, useEffect, useState} from 'react'
import {Avatar, Radio, Space, List, Checkbox, DatePicker, Select, Option, Button, Row, Col} from 'antd'
import PeopleMostActive from './PeopleMostActive';
import FilterDashboard from './FilterDashboard';
import TopPeople from './TopPeople';
import moment from 'moment/moment';
import 'moment/locale/es';
import { format } from 'path';
import { now } from 'lodash';
import {FaGooglePlay, FaAppStoreIos} from "react-icons/fa";


export const SidebarYnl = () => {
  moment.locale('es');
  const date = moment().format('DD/MM/YYYY');
  const day = moment().format('dddd');
  return (
    <div className='container-menu'>
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
                    <h2 className='subtitles' style={{textTransform:"capitalize"}}><b>{day}</b></h2>
                    <h2 className='subtitles'><b>{date}</b></h2>
                </div> 
            </div>
        </div>
        <hr />
        <div className='flex-item aligned-to-left subtitles'>
            <div>
                <FilterDashboard /> 
            </div>
        </div>
        {/*<hr />*/}
        {/*<div className='flex-item'>*/}
        {/*    <div>*/}
        {/*        <h3 className='aligned-to-left subtitles'><b>Top personas:</b></h3>*/}
        {/*        <TopPeople />*/}
        {/*    </div>*/}
        {/*</div>*/}
        <hr />
        <div className='flex-item'>
            <div>
                <h3 className='aligned-to-left subtitles'><b>Personas más activas:</b></h3>
                <PeopleMostActive />
            </div>
        </div>
        <div className='flex-item'>
            <a href="https://play.google.com/store/apps/details?id=com.hiumanlab.ynl&hl=es_MX">
                <div style={{backgroundColor:"#1C1B2B", padding:"10px", borderRadius:"15px", cursor:"pointer"}} >
                    <Row className="aligned-to-center">
                        <Col span={6}>
                            <FaGooglePlay style={{color:"white", fontSize:"30px"}} />
                        </Col>
                        <Col span={18}>
                            <span style={{color:"white"}}>Disponible en <br /> Google Play</span>
                        </Col>
                    </Row>
                </div>
            </a>
        </div>
        <div className='flex-item'>
            <a href="https://apps.apple.com/mx/app/your-next-level/id1623871887">
                <div style={{backgroundColor:"#1C1B2B", padding:"10px", borderRadius:"15px", cursor:"pointer"}} >
                    <Row className="aligned-to-center">
                        <Col span={6}>
                            <FaAppStoreIos style={{color:"white", fontSize:"30px"}} />
                        </Col>
                        <Col span={18}>
                            <span style={{color:"white"}}>Disponible en <br /> App Store</span>
                        </Col>
                    </Row>
                </div>
            </a> 
        </div>
    </div>
  )
}
