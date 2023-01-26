import React, { useState, useMemo, useContext } from 'react';
import { connect } from 'react-redux';
import { Calendar, Spin, message } from 'antd';
import CalendarHeader from './CalendarHeader';
import CalendarDateCell from './CalendarDateCell';
import CalendarMonthCell from './CalendarMonthCell';
import EventDetails from './EventDetails';
import EventForm from './EventForm';
import ListItems from '../../../common/ListItems';
import moment from 'moment';
import { getInterviews } from '../../../redux/jobBankDuck';
import { InterviewContext } from '../context/InterviewContext';

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
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemToDetail, setItemToDetail] = useState({});
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemToDelete, setItemToDelete] = useState([]);
    const { actionUpdate, actionDelete, fetchAction } = useContext(InterviewContext);

    const closeModalDetail = () =>{
        setOpenModalDetail(false)
        setItemToDetail({})
    }

    const closeModalForm = () =>{
        setOpenModalForm(false)
        setItemToEdit({});
    }

    const closeModalDelete = () =>{
        setItemToDelete([]);
        setOpenModalDelete(false)
    }

    const showModalDelete = () =>{
        setItemToDelete([itemToDetail])
        setOpenModalDelete(true)
        closeModalDetail()
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
            <Spin spinning={load_interviews}>
                <Calendar
                    className='calendar-interviews'
                    headerRender={getHeader}
                    dateCellRender={getCell}
                    monthCellRender={getMonth}
                />
            </Spin>
            <EventDetails
                itemToDetail={itemToDetail}
                close={closeModalDetail}
                visible={openModalDetail}
                showModalForm={()=> fetchAction(showModalForm)}
                showModalDelete={()=> fetchAction(showModalDelete)}
            />
            <EventForm
                visible={openModalForm}
                close={closeModalForm}
                itemToEdit={itemToEdit}
                actionForm={e => actionUpdate(itemToEdit.id, e)}
            />
            <ListItems
                title='¿Estas seguro de eliminar este evento?'
                visible={openModalDelete}
                itemsToList={itemToDelete}
                close={closeModalDelete}
                keyTitle='all_data_response, summary'
                actionConfirm={()=> actionDelete(itemToDelete?.at(-1).id)}
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