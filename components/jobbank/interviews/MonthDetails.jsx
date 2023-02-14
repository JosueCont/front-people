import React, { useMemo, useEffect, useState} from 'react';
import moment from 'moment';
import {
    ContentVertical,
    ContentNormal,
    TextDescripcion
} from './StyledInterview';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const ContentEvents = styled.div`
    padding: 18px;
    background-color: #ffff;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-top: 2px solid #f0f0f0;
`;

const BallEvent = styled.span`
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: rgb(3, 155, 229);
`;

const ItemEvent = styled(ContentNormal)`
    padding: 5px 10px;
    border-radius: 12px;
    cursor: pointer;
    :hover{
        background-color: #f0f0f0;
    }
`;

const ContentMonths = styled(ContentVertical)`
    & .month:not(:last-child){
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;
    }
    & .title{
        width: 100px;
    }
    & .list{
        width: calc(100% - 100px);
    }
`;

const MonthDetails = ({
    showModalDetails =()=>{}
}) => {

    const {
        list_interviews,
        load_interviews
    } = useSelector(state => state.jobBankStore);
    const router = useRouter();
    const [segmentation, setSegmentation] = useState({});
    const format = 'hh:mm a';
    const formatMonth = 'MM';
    const formatDay = 'DD-MM-YYYY';

    useEffect(()=>{
        setSegmentation({})
        if(Object.keys(list_interviews).length <= 0) return;
        if(list_interviews.results?.length <=0) return;
        getEvents()
    },[list_interviews, router.query?.mth])

    const getEvents = () =>{
        let month = router.query?.mth ?? null;
        let pos_month = month && month.length <= 1 ? "0"+month : month;
        let results = list_interviews.results?.reduce((acc, current) =>{
            let start = current?.all_data_response?.start?.dateTime;
            let date_month = moment(start).format(formatMonth);
            if(month && pos_month != date_month) return acc;
            let date_day = moment(start).format(formatDay);
            let list_month = acc[date_month] ?? {};
            let list_day = list_month[date_day] ?? [];
            let itemDay = [...list_day, current];
            let itemMonth = {...list_month, [date_day]: itemDay};
            if(month) return {...acc, ...itemMonth};
            return {...acc, [date_month]: itemMonth};
        }, {})
        setSegmentation(results)
    }

    const getDescription = (item) =>{
        let size = Object.keys(item).length;
        if(size <=0) return null;
        let start = item?.all_data_response?.start?.dateTime;
        let end = item?.all_data_response?.end?.dateTime;
        if(!start || !end) return null;
        let init = moment(start).format(format);
        let finish = moment(end).format(format);
        return `${init} - ${finish}`;
    }

    const getMonth = (num) =>{
        let pos = parseInt(num) - 1;
        let locale = moment().locale('es-mx').localeData();
        let month = locale.months()[pos];
        if(!month) return null; 
        return `${month?.charAt(0).toUpperCase()}${month?.slice(1)}`;
    }

    const getDay = (date) =>{
        return moment(date, formatDay).locale('es-mx').format('DD, dddd');
    }

    const ComponentEvent = ({event}) => (
        <ItemEvent gap={16} onClick={()=> showModalDetails(event)}>
            <ContentNormal gap={8}>
                <BallEvent/>
                <TextDescripcion>
                    {getDescription(event)}
                </TextDescripcion>
            </ContentNormal>
            <TextDescripcion>
                {event?.all_data_response?.summary}
            </TextDescripcion>
        </ItemEvent>
    )
    
    const ComponentDay = ({record}) => (
        <>
            {!router.query?.mth ? (
                <ContentVertical gap={4}>
                    <TextDescripcion isTitle weight={500}>
                        {getDay(record[0])}
                    </TextDescripcion>
                    {Array.isArray(record[1]) && record[1]?.map((event, idx) => (
                        <ComponentEvent event={event} key={"event_"+idx} />
                    ))}
                </ContentVertical>
            ): (
                <ComponentEvent event={record[1]}/>
            )}
        </>
    )

    const ComponentYear = ({item}) => (
        <ContentNormal className='month' gap={8}>
            <TextDescripcion isTitle weight={500} className='title'>
                {router.query?.mth ? getDay(item[0]) : getMonth(item[0])}
            </TextDescripcion>
            <ContentVertical gap={16} className='list'>
                {Object.entries(item[1]).map((record, idx) => (
                    <ComponentDay key={"record_"+idx} record={record}/>
                ))}
            </ContentVertical>
        </ContentNormal>  
    )

    return (
        <ContentEvents>
            <ContentMonths gap={8}>
                {Object.entries(segmentation).length > 0
                    ? Object.entries(segmentation).map((item, idx) =>(
                    <ComponentYear key={"item_"+idx} item={item}/>                       
                )) : (
                    <div className='placeholder-list-items'>
                        <p>Ningún evento agendado</p>
                    </div>
                )}
            </ContentMonths>
        </ContentEvents>
    )
}

export default MonthDetails