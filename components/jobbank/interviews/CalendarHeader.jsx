import React, { useMemo, useEffect, useCallback } from 'react';
import { Radio, Select, Tooltip, Button } from 'antd';
import moment from 'moment';

const CalendarHeader = ({
    value,
    type,
    onChange,
    onTypeChange,
    setOpenModalEvent
})=> {

    const nowDate = new Date();
    const current = value?.locale('es-Mx')?.clone();
    const year = current?.year();
    const month = current?.month();
    const months = current?.localeData()?.months();
    const days =  current?.localeData().weekdays();

    const getLabel = (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

    // const monthOptions = useMemo(()=>{
    //     const map_ = (_, idx)=> ({value: idx, key: idx, label: getLabel(months[idx])});
    //     return Array(12).fill(null).map(map_);
    // },[])

    // const yearsOptions = useMemo(()=>{
    //     let range = (year + 10)- (year - 10);
    //     return Array(range).fill(null).map((_, idx) =>{
    //         let result = idx > 10 ? year + (idx - 10) : year - (10 - idx);
    //         return {value: result, key: result, label: `${result}`};
    //     })
    // },[])

    // const onChangeYear = (newYear) =>{
    //     let now = current?.year(newYear);
    //     onChange(now);
    // }

    // const onChangeMonth = (newMonth) => {
    //     let now = current?.month(newMonth);
    //     onChange(now);
    // }

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
        // let limitYear = year >= maxYear ? maxYear : year + 1;
        // let newMonth = month == 11 ? month : month + 1;
        // let newYear = month == 11 ? limitYear : year;
        if(type == 'month' && month == 11 && year >= maxYear) return;
        if(type == 'year' && year >= maxYear) return;
        let next = type == 'year' ? current?.year(year+1) : current?.year(year).month(month+1);
        onChange(next);
    }

    const prevMonth = () =>{
        let minYear = nowDate.getFullYear() - 10;
        // let limitYear = year <= minYear ? minYear : year - 1;
        // let newMonth = month == 0 ? 11 : month - 1;
        // let newYear = month == 0 ? limitYear : year; 
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
                <Button onClick={()=> setOpenModalEvent(true)}>Agregar</Button>
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
                {/* <Radio.Group
                    size='small'
                    onChange={(e) => onTypeChange(e.target.value)}
                    value={type}
                >
                    <Radio.Button value='month'>Mes</Radio.Button>
                    <Radio.Button value='year'>Año</Radio.Button>
                </Radio.Group> */}
                {/* <Select
                    showSearch
                    size='small'
                    value={year}
                    placeholder='Año'
                    options={yearsOptions}
                    onChange={onChangeYear}
                    optionFilterProp='label'
                    notFoundContent='No se encontraron resultados'
                    style={{width: '100px'}}
                /> */}
                {/* <Select
                    size='small'
                    value={month}
                    placeholder='Mes'
                    options={monthOptions}
                    onChange={onChangeMonth}
                    optionFilterProp='label'
                    notFoundContent='No se encontraron resultados'
                    style={{width: '100px'}}
                /> */}
            </div>
        </div>
    )
}

export default CalendarHeader;