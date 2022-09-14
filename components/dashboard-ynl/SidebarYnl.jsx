import {React, useEffect, useState} from 'react'
import {Avatar, Radio, Space, List, Checkbox, DatePicker, Select, Option} from 'antd'
import { TopPeople } from './TopPeople';
import { PeopleMostActive } from './PeopleMostActive';
import  FilterDashboard from './FilterDashboard';
import moment from 'moment/moment';
import { format } from 'path';

export const SidebarYnl = () => {
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
                    <h2 className='subtitles'><b>Martes</b></h2>
                    <h2 className='subtitles'><b>06/Sep/22</b></h2>
                </div> 
            </div>
        </div>
        <hr />
        <div className='flex-item aligned-to-left subtitles'>
            <div>
                <FilterDashboard /> 
            </div>
        </div>
        <hr />
        <div className='flex-item'>
            <div>
                <h3 className='aligned-to-left subtitles'><b>Top personas:</b></h3>
                <TopPeople />
            </div>
        </div>
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
