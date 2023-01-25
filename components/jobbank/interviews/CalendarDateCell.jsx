import React, { useEffect, useMemo } from 'react';
import { eventsJb } from '../../../utils/events';
import styled from '@emotion/styled';
import { css} from "@emotion/core";
import moment from 'moment';

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Event = styled.div(({
    confirmed = false
}) => {

    let colorBlue = 'rgb(3, 155, 229)';
    let colorWhite = '#ffff';

    return css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        background-color: ${confirmed ? colorBlue : colorWhite};
        border-radius: 12px;
        padding: 2px 6px;
        border-radius: 10px;
        border: 1px solid rgb(3, 155, 229);
        & p {
            color: #ffff;
            width: 65%;
            max-width: 65%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-bottom: 0px;
            color: ${confirmed ? colorWhite : colorBlue};
        }
        & span{
            color: ${confirmed ? colorWhite : colorBlue};
        }
    `;
});

const CalendarDateCell = ({
    date,
    setOpenModal,
    setItemToDetail
}) => {

    const format = 'YYYY-MM-DD';
    const current = moment(date)?.format(format);

    const formatDate = value => moment(value).format(format);

    const eventsDay = useMemo(()=>{
        if(!current) return [];
        const validate = item => formatDate(item.start.dateTime) == current;
        let exist = eventsJb.some(validate);
        if(!exist) return [];
        return eventsJb.filter(validate);
    },[current])

    const showModal = (item) =>{
        setOpenModal(true)
        setItemToDetail(item)
    }

    return eventsDay.length > 0 ? (
        <List>
            {eventsDay.map((item, idx) => (
                <Event
                    key={idx}
                    onClick={()=> showModal(item)}
                    confirmed={item.status == 'confirmed'}
                >
                    <p>{item.summary}</p>
                    <span>{moment(item.start.dateTime).format('hh:mm a')}</span>
                </Event>
            ))}
        </List>
    ) : null;
}

export default CalendarDateCell