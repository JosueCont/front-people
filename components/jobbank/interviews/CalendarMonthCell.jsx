import React, { useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { css} from "@emotion/core";
import moment from 'moment';
import { useSelector } from 'react-redux';

const Event = styled.div`
    width: 100%;
    background-color: rgb(3, 155, 229);
    border-radius: 12px;
    padding: 2px 6px;
    border-radius: 10px;
    border: 1px solid rgb(3, 155, 229);
    & p {
        color: #ffff;
        width: 100%;
        max-width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        margin-bottom: 0px;
    }
`;

const CalendarMonthCell = (date) => {

    const {
        list_interviews,
        load_interviews
    } = useSelector(state => state.jobBankStore);
    const format = 'YYYY-MM';
    const current = moment(date)?.format(format);

    const formatDate = value => moment(value).format(format);

    const eventsMonth = useMemo(()=>{
        if(!current || list_interviews.results?.length <=0) return [];
        const validate = item => formatDate(item.event?.start?.dateTime) == current;
        let exist = list_interviews.results?.some(validate);
        if(!exist) return [];
        return list_interviews.results?.filter(validate);
        // return results.reduce((acc, record) => {
        //     let prev = acc[record.status] ?? [];
        //     let item = [...prev, record];
        //     return {...acc, [record.status]: item};
        // }, {});
    },[current, list_interviews])

    return eventsMonth.length > 0 ? (
        <Event><p>Eventos del mes {eventsMonth.length}</p></Event>
    ) : null;
}

export default CalendarMonthCell