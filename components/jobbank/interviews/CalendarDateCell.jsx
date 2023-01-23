import React, { useEffect, useMemo } from 'react';
import moment from 'moment';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { ContentVertical, EventInfo, EventSkeleton } from './StyledInterview';

const CalendarDateCell = ({
    date,
    showModalDetails = ()=>{}
}) => {

    const {
        list_interviews,
        load_interviews
    } = useSelector(state => state.jobBankStore);
    const format = 'YYYY-MM-DD';
    const current = moment(date)?.format(format);

    const formatDate = value => moment(value).format(format);

    const eventsDay = useMemo(()=>{
        if(!current || list_interviews.results?.length <= 0) return [];
        const validate = item => formatDate(item.event?.start?.dateTime) == current;
        let exist = list_interviews.results?.some(validate);
        if(!exist) return [];
        return list_interviews.results?.filter(validate);
    },[current, list_interviews])

    return eventsDay.length > 0 ? (
        <ContentVertical gap={4}>
            {eventsDay.map((item, idx) => (
                // <EventSkeleton key={idx+"_"}>
                    <EventInfo
                        key={idx}
                        onClick={()=> showModalDetails(item)}
                    >
                        <p>{item.event?.summary}</p>
                        <span>{moment(item.event?.start?.dateTime).format('hh:mm a')}</span>
                    </EventInfo>
                // </EventSkeleton>
            ))}
        </ContentVertical>
    ) : null;
}

export default CalendarDateCell