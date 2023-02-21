import React, { useMemo } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { ContentVertical, EventInfo } from './StyledInterview';
import { useRouter } from 'next/router';

const CalendarDateCell = ({
    value,
    showModalDetails = ()=>{}
}) => {

    const {
        list_interviews,
        load_interviews
    } = useSelector(state => state.jobBankStore);
    const router = useRouter();
    const format = 'YYYY-MM-DD';
    const currentMonth = moment()?.month()+1;
    const current = moment(value)?.format(format);
    
    const formatDate = value => moment(value).format(format);

    const eventsDay = useMemo(()=>{
        if(!current || list_interviews.results?.length <= 0) return [];
        const validate = item => formatDate(item?.all_data_response?.start?.dateTime) == current;
        let exist = list_interviews.results?.some(validate);
        if(!exist) return [];
        return list_interviews.results?.filter(validate);
    },[current, list_interviews])

    const getEquals = (item) =>{
        let date = item?.all_data_response?.start?.dateTime;
        let month = moment(date).format('MM');
        let monthQuery = router.query?.mth
            ? parseInt(router.query?.mth)
            : currentMonth;
        return parseInt(month) == monthQuery;
    }

    return eventsDay.length > 0 ? (
        <ContentVertical gap={4}>
            {eventsDay.map((item, idx) => (
                <EventInfo
                    key={item.id}
                    equals={getEquals(item)}
                    onClick={()=> showModalDetails(item)}
                >
                    <p title={item?.all_data_response?.summary}>
                        {moment(item?.all_data_response?.start?.dateTime).format('hh:mm a')} {item?.all_data_response?.summary}
                    </p>
                </EventInfo>
            ))}
        </ContentVertical>
    ) : null;
}

export default CalendarDateCell