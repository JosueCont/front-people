import React, { useMemo, useEffect, useCallback } from 'react';
import { Radio, Select, Tooltip, Button } from 'antd';
import moment from 'moment';

const CalendarHeader = ({
    value,
    type,
    onChange,
    onTypeChange
})=> {

    const nowDate = new Date();
    const current = value?.locale('es-Mx')?.clone();
    const year = current?.year();
    const month = current?.month();
    const months = current?.localeData()?.months();
    const days =  current?.localeData().weekdays();

    const getLabel = (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

    const today = useMemo(()=>{
        let day = days[nowDate.getDay()];
        let month = months[nowDate.getMonth()];
        let title = `${day}, ${nowDate.getDate()} ${month}`;
        return getLabel(title);
    },[])

    const currentMonth = useMemo(()=>{
        let title = `${months[month]} ${year}`;
        return type == 'month' ? getLabel(title) : year;
    },[month, year, type])

    const nextMonth = () =>{
        let maxYear = nowDate.getFullYear() + 9;
        if(type == 'month' && month == 11 && year >= maxYear) return;
        if(type == 'year' && year >= maxYear) return;
        let next = type == 'year' ? current?.year(year+1) : current?.year(year).month(month+1);
        onChange(next);
    }

    const prevMonth = () =>{
        let minYear = nowDate.getFullYear() - 10;
        if(type == 'month' && month == 0 && year <= minYear) return;
        if(type == 'year' && year <= minYear) return;
        let prev = type == 'year' ? current?.year(year-1) : current?.year(year).month(month-1);
        onChange(prev);
    }

    return (
        <div className={`calendar-header ${type == 'month' ? 'border-card' : ''}`}>
            <div className='calendar-title'>
                <p role='title'>Calendario</p>
                <div className='content-end' style={{gap: 8}}>
                    <Tooltip title={today} placement='bottom'>
                        <button onClick={()=> onChange(moment())}>Hoy</button>
                    </Tooltip>
                    <Tooltip title={type == 'month' ? 'Mes anterior' : 'Año anterior'} placement='bottom'>
                        <button role='prev' onClick={()=> prevMonth()}>{`<`}</button>
                    </Tooltip>
                    <Tooltip title={type == 'month' ? 'Mes siguiente' : 'Año siguiente'} placement='bottom'>
                        <button role='next' onClick={()=> nextMonth()}>{`>`}</button>
                    </Tooltip>
                </div>
                <p role='month'>{currentMonth}</p>
            </div>
            <div className='content-end' style={{gap: 8}}>
                <Select
                    className='select-jb'
                    value={type}
                    placeholder='Año'
                    onChange={e => onTypeChange(e)}
                    optionFilterProp='label'
                    notFoundContent='No se encontraron resultados'
                    style={{width: '80px'}}
                    options={[
                        {value: 'month', key: 'month', label: 'Mes'},
                        {value: 'year', key: 'year', label: 'Año'}
                    ]}
                />
            </div>
        </div>
    )
}

export default CalendarHeader;