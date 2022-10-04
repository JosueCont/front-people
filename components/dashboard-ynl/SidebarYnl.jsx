import {React, useEffect, useState} from 'react'
import {Avatar, Radio, Space, List, Checkbox, DatePicker, Select, Option} from 'antd'
import PeopleMostActive from './PeopleMostActive';
import FilterDashboard from './FilterDashboard';
import TopPeople from './TopPeople';
import moment from 'moment/moment';
import 'moment/locale/es';
import { format } from 'path';
import { now } from 'lodash';


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
    </div>
  )
}
