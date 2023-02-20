import React, { useMemo, useEffect, useState} from 'react';
import moment from 'moment';
import {
    ContentVertical,
    ContentNormal,
    TextDescripcion
} from './StyledInterview';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
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
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgb(3, 155, 229);
`;

const ItemEvent = styled(ContentNormal)`
    padding: 5px 10px;
    border-radius: 12px;
    cursor: pointer;
    :hover{
        background-color: rgba(1,1,1,0.03);
    }
`;

const ContentMonth = styled(ContentNormal)`
    :not(:last-child){
        padding-bottom: 8px;
        border-bottom: 1px solid #f0f0f0;
    }
`;

const TitleMonth = styled.div`
    width: 100px;
    text-align: center;
    ${({equals}) => equals && css`
        border-radius: 12px;
        padding: 2px 6px;
        background-color: rgb(3, 155, 229);
    `};
    & p{
        font-size: 14px;
        margin-bottom: 0px;
        color: ${({equals}) => equals ? '#ffff' :'rgb(60,64,67)'};
        font-weight: ${({equals}) => equals ? 400 : 500};
        line-height: 1.2;
    }
`;

const TitleDay = styled.div`
    margin-left: 10px;
`;

const StyleDay = css`
    padding: 5px;
    border-radius: 12px;
    background-color: rgba(3, 155, 229,0.06);
    box-sizing: border-box;
    & .event:hover{
        background-color: #ffff;
    }
`;

const ContentList = styled(ContentVertical)`
    width: calc(100% - 100px);
    ${({equals}) => equals ? StyleDay : css`
        margin-left: 5px;
    `};
`;

const ContentDay = styled(ContentVertical)`
    ${({equals}) => equals ? StyleDay : css`
        margin-left: 5px;
    `};
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
    },[
        list_interviews,
        router.query?.mth,
        router.query?.type
    ])

    const getEvents = () =>{
        let month = router.query?.mth ?? `${moment().month()+1}`;
        let pos_month = month.length <= 1 ? "0"+month : month;
        let type = router.query?.type;
        let results = list_interviews.results?.reduce((acc, current) =>{
            let start = current?.all_data_response?.start?.dateTime;
            let date_month = moment(start).format(formatMonth);
            if(type !== 'year' && pos_month != date_month) return acc;
            let date_day = moment(start).format(formatDay);
            let list_month = acc[date_month] ?? {};
            let list_mode = type !== 'year' ? acc : list_month;
            let list_day = list_mode[date_day] ?? [];
            let itemDay = [...list_day, current];
            if(type !== 'year') return {...acc, [date_day]: itemDay};
            let itemMonth = {...list_month, [date_day]: itemDay};
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

    const equalsMonth = (item)=> parseInt(item[0]) == moment().month()+1;
    const equalsDay = (record) =>{
        let day = moment(record[0], formatDay).format(formatDay);
        return day == moment().format(formatDay);
    }

    const ComponentEvent = ({event}) => (
        <ItemEvent className='event' gap={16} onClick={()=> showModalDetails(event)}>
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
        <ContentDay equals={equalsDay(record)} gap={2}>
            <TitleDay>
                <TextDescripcion isTitle weight={500}>
                    {getDay(record[0])}
                </TextDescripcion>
            </TitleDay>
            <ContentVertical>
                {Array.isArray(record[1]) && record[1]?.map((event, idx) => (
                    <ComponentEvent event={event} key={"event_"+idx} />
                ))}
            </ContentVertical>
        </ContentDay>
    )

    const ComponentYear = ({item}) => {
        let type = router.query?.type;
        let equals = type == 'year' ? equalsMonth(item) : equalsDay(item);
        let title = type == 'year' ? getMonth(item[0]) : getDay(item[0]);
        return(
            <ContentMonth gap={8}>
                <TitleMonth equals={equals}>
                    <p>{title}</p>
                </TitleMonth>
                <ContentList
                    equals={type == 'year' ? false : equals}
                    gap={type == 'year' ? 8 : 0}
                >
                    {Object.entries(item[1]).map((record, idx) => (
                        <>{type == 'year'
                            ? <ComponentDay key={"record_"+idx} record={record}/>
                            : <ComponentEvent key={"record_"+idx} event={record[1]}/>
                        }</>
                    ))}
                </ContentList>
            </ContentMonth>  
        )
    }

    return (
        <ContentEvents>
            <ContentVertical gap={8}>
                {Object.entries(segmentation).length > 0
                    ? Object.entries(segmentation).map((item, idx) =>(
                    <ComponentYear key={"item_"+idx} item={item}/>                       
                )) : (
                    <div className='placeholder-list-items'>
                        <p>Ningún evento agendado</p>
                    </div>
                )}
            </ContentVertical>
        </ContentEvents>
    )
}

export default MonthDetails