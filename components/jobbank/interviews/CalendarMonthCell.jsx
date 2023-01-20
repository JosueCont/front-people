import React, { useEffect, useMemo } from 'react';
import { eventsJb } from '../../../utils/events';
import styled from '@emotion/styled';
import { css} from "@emotion/core";
import moment from 'moment';

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

    const format = 'YYYY-MM';
    const current = moment(date)?.format(format);

    const formatDate = value => moment(value).format(format);

    const eventsMonth = useMemo(()=>{
        if(!current) return [];
        const validate = item => formatDate(item.start.dateTime) == current;
        let exist = eventsJb.some(validate);
        if(!exist) return [];
        return eventsJb.filter(validate);
        // return results.reduce((acc, record) => {
        //     let prev = acc[record.status] ?? [];
        //     let item = [...prev, record];
        //     return {...acc, [record.status]: item};
        // }, {});
    },[current])

    return eventsMonth.length > 0 ? (
        <Event><p>Eventos del mes {eventsJb.length}</p></Event>
    ) : null;
}

export default CalendarMonthCell