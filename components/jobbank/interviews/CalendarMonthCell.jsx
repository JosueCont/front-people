import React, { useEffect, useMemo } from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { EventInfo } from './StyledInterview';

const CalendarMonthCell = ({date}) => {

    const {
        list_interviews,
        load_interviews
    } = useSelector(state => state.jobBankStore);
    const router = useRouter();
    const format = 'YYYY-MM';
    const current = moment(date)?.format(format);

    const formatDate = value => moment(value).format(format);

    const eventsMonth = useMemo(()=>{
        if(!current || list_interviews.results?.length <=0) return [];
        const validate = item => formatDate(item.all_data_response?.start?.dateTime) == current;
        let exist = list_interviews.results?.some(validate);
        if(!exist) return [];
        return list_interviews.results?.filter(validate);
    },[current, list_interviews])

    const showEvents = () =>{
        router.replace({
            pathname: '/jobbank/interviews',
            query: {...router.query, view: 'schedule'}
        }, undefined, {shallow:true})
    }

    return eventsMonth.length > 0 ? (
        <EventInfo equals={true}>
            <p>Eventos del mes {eventsMonth.length}</p>
        </EventInfo>
    ) : null;
}

export default CalendarMonthCell