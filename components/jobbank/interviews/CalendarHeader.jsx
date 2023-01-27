import React, { useMemo, useEffect, useCallback } from 'react';
import { Radio, Select, Tooltip, Button } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';

const CalendarHeader = ({
    value,
    type,
    onChange,
    onTypeChange,
    rangeYear = 5
})=> {

    const router = useRouter();
    const nowDate = new Date();
    const current = value?.locale('es-Mx')?.clone();
    const year = router.query?.year ? parseInt(router.query.year) : current?.year();
    const month = current?.month();
    const months = current?.localeData()?.months();
    const days =  current?.localeData().weekdays();
    const minYear = nowDate.getFullYear() - rangeYear;
    const maxYear = nowDate.getFullYear() + rangeYear;

    const getLabel = (value) => `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

    const yearsOptions = useMemo(()=>{
        let range = (year + rangeYear) - (year - rangeYear);
        return Array(range).fill(null).map((_, idx) =>{
            let result = idx > rangeYear ? year + (idx - rangeYear) : year - (rangeYear - idx);
            return {value: result, key: result, label: `${result}`};
        })
    },[])

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
        // if(type == 'month' && month == 11 && year >= maxYear) return;
        if(type == 'month' && month >= 11) return;
        if(type == 'year' && year >= maxYear) return;
        let next = current?.year(year).month(month+1);
        if(type == 'year') onChangeYear(year+1);
        else onChange(next);
    }

    const prevMonth = () =>{
        // if(type == 'month' && month == 0 && year <= minYear) return;
        if(type == 'month' && month <= 0) return;
        if(type == 'year' && year <= minYear) return;
        let prev = current?.year(year).month(month-1);
        if(type == 'year') onChangeYear(year-1);
        else onChange(prev);
    }

    const onChangeYear = (newYear) =>{
        router.replace({
            pathname: '/jobbank/interviews/',
            query: {...router.query, year: newYear}
        })
    }

    const { titlePrev, titleNext} = useMemo(() =>{
        let titlePrev = '';
        let titleNext = '';
        if(type == 'month'){
            titlePrev = month <= 0 ? '' : 'Mes anterior'; 
            titleNext =  month >= 11 ? '' : 'Mes siguiente';
        }
        if(type == 'year'){
            titlePrev = year <= minYear ? '' : 'Año anterior';
            titleNext =  year >= maxYear ? '' : 'Año siguiente';
        }
        return { titlePrev, titleNext };
    }, [type, month, year])

    return (
        <div className={`calendar-header ${type == 'month' ? 'border-card' : ''}`}>
            <div className='calendar-title'>
                <p role='title'>Calendario</p>
                <div className='content-end' style={{gap: 8}}>
                    <Tooltip title={today} placement='bottom'>
                        <button onClick={()=> onChange(moment())}>Hoy</button>
                    </Tooltip>
                    <Tooltip title={titlePrev} placement='bottom'>
                        <button disabled={!titlePrev} role='prev' onClick={()=> prevMonth()}>
                            {`<`}
                        </button>
                    </Tooltip>
                    <Tooltip title={titleNext} placement='bottom'>
                        <button disabled={!titleNext} role='next' onClick={()=> nextMonth()}>
                            {`>`}
                        </button>
                    </Tooltip>
                </div>
                <p role={(!titlePrev || !titleNext) ? 'stop' : 'month'}>{currentMonth}</p>
            </div>
            <div className='content-end' style={{gap: 8}}>
                <Select
                    className='select-jb'
                    showSearch
                    value={year}
                    placeholder='Año'
                    options={yearsOptions}
                    onChange={onChangeYear}
                    optionFilterProp='label'
                    notFoundContent='No se encontraron resultados'
                    style={{width: '100px'}}
                />
                <Select
                    className='select-jb'
                    value={type}
                    placeholder='Tipo'
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