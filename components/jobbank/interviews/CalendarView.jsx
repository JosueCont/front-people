import React, { useState, useMemo } from 'react';
import { Calendar } from 'antd';
import CalendarHeader from './CalendarHeader';
import CalendarDateCell from './CalendarDateCell';
import CalendarMonthCell from './CalendarMonthCell';
import EventDetails from './EventDetails';
import EventForm from './EventForm';
import moment from 'moment';

//Formato para la semana
const weekdaysMin = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SAB'];
const monthsShort = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
moment.updateLocale('es_ES', { weekdaysMin, monthsShort });

const CalendarView = () => {

    const [openModal, setOpenModal] = useState(false);
    const [openModalEvent, setOpenModalEvent] = useState(false);
    const [itemToDetail, setItemToDetail] = useState({});

    const propsCell = {
        setOpenModal,
        setItemToDetail
    }

    const getHeader = e => <CalendarHeader {...{...e, setOpenModalEvent}}/>;
    const getCell = e => <CalendarDateCell {...{...propsCell, date: e}}/>;
    const getMonth = e => <CalendarMonthCell {...e}/>;

    const closeModal = () =>{
        setOpenModal(false)
        setItemToDetail({})
    }

    return (
        <>
            <Calendar
                className='calendar-interviews'
                headerRender={getHeader}
                dateCellRender={getCell}
                monthCellRender={getMonth}
                onSelect={e => console.log('on select---->', e)}
                // dateFullCellRender={getCell}
            />
            <EventDetails
                itemToDetail={itemToDetail}
                close={closeModal}
                visible={openModal}
            />
            <EventForm
                visible={openModalEvent}
            />
        </>
    )
}

export default CalendarView