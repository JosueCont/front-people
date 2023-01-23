import React, { useState, useMemo } from 'react';
import { connect } from 'react-redux';
import { Calendar, Spin, message } from 'antd';
import CalendarHeader from './CalendarHeader';
import CalendarDateCell from './CalendarDateCell';
import CalendarMonthCell from './CalendarMonthCell';
import EventDetails from './EventDetails';
import EventForm from './EventForm';
import moment from 'moment';
import { getInterviews } from '../../../redux/jobBankDuck';

//Formato para la semana
const weekdaysMin = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SAB'];
const monthsShort = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
moment.updateLocale('es_ES', { weekdaysMin, monthsShort });

const CalendarView = ({
    currentNode,
    jobbank_filters,
    jobbank_page,
    list_interviews,
    load_interviews,
    getInterviews
}) => {

    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [openModalForm, setOpenModalForm] = useState(false);
    const [itemToDetail, setItemToDetail] = useState({});
    const [itemToEdit, setItemToEdit] = useState({});

    const actionUpdate = async (values) =>{
        try {
            getInterviews(currentNode.id, jobbank_filters, jobbank_page);
            message.success('Evento actualizado');
        } catch (e) {
            console.log(e)
            message.error('Evento no actualizado');
        }
    }

    const closeModalDetail = () =>{
        setOpenModalDetail(false)
        setItemToDetail({})
    }

    const closeModalForm = () =>{
        setOpenModalForm(false)
        setItemToEdit({});
    }

    const showModalForm = () =>{
        setItemToEdit(itemToDetail)
        setOpenModalForm(true)
        closeModalDetail();
    }

    const showModalDetails = (item) =>{
        setItemToDetail(item)
        setOpenModalDetail(true)
    }

    const getHeader = e => <CalendarHeader {...e}/>;
    const getCell = e => <CalendarDateCell {...{showModalDetails, date: e}}/>;
    const getMonth = e => <CalendarMonthCell {...e}/>;

    return (
        <>
            <Calendar
                className='calendar-interviews'
                headerRender={getHeader}
                dateCellRender={getCell}
                monthCellRender={getMonth}
                onSelect={e => console.log('on select---->', e)}
            />
            <EventDetails
                itemToDetail={itemToDetail}
                close={closeModalDetail}
                visible={openModalDetail}
                showModalForm={showModalForm}
            />
            <EventForm
                visible={openModalForm}
                close={closeModalForm}
                itemToEdit={itemToEdit}
                actionForm={actionUpdate}
            />
        </>
    )
}

const mapState = (state) =>{
    return {
        list_interviews: state.jobBankStore.list_interviews,
        load_interviews: state.jobBankStore.load_interviews,
        jobbank_page: state.jobBankStore.jobbank_page,
        jobbank_filters: state.jobBankStore.jobbank_filters,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, { getInterviews }
)(CalendarView);