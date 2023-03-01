import React, { useState, useMemo, useContext, useCallback } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useRouter } from 'next/router';
import { Calendar, Spin, message } from 'antd';
import CalendarHeader from './CalendarHeader';
import CalendarDateCell from './CalendarDateCell';
import CalendarMonthCell from './CalendarMonthCell';
import EventDetails from './EventDetails';
import MonthDetails from './MonthDetails';
import EventForm from './EventForm';
import ListItems from '../../../common/ListItems';
import { getInterviews } from '../../../redux/jobBankDuck';
import { InterviewContext } from '../context/InterviewContext';
import WebApiJobBank from '../../../api/WebApiJobBank';

//Formato para la semana
// const weekdaysMin = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SAB'];
// const monthsShort = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
// moment.updateLocale('es_ES', { weekdaysMin, monthsShort });

const CalendarView = ({
    currentNode,
    jobbank_filters,
    jobbank_page,
    list_interviews,
    load_interviews,
    getInterviews
}) => {

    const router = useRouter();
    const currentMonth = moment()?.month()+1;
    const [openModalDetail, setOpenModalDetail] = useState(false);
    const [openModalForm, setOpenModalForm] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [itemToDetail, setItemToDetail] = useState({});
    const [itemToEdit, setItemToEdit] = useState({});
    const [itemToDelete, setItemToDelete] = useState([]);
    const { fetchAction, token, createData } = useContext(InterviewContext);

    const actionUpdate = async (values) =>{
        try {
            let body = createData(values);
            let headers = {'access-token': token.access_token};
            await WebApiJobBank.updateInterview(itemToEdit.id, body, headers);
            getInterviews(currentNode.id, jobbank_filters)
            message.success('Evento actualizado')
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.message;
            let msg = error ? error : 'Evento no actualizado';
            message.error(msg)
        }
    }

    const actionDelete = async () =>{
        try {
            let event_id = itemToDelete?.at(-1)?.id;
            let headers = {'access-token': token.access_token};
            await WebApiJobBank.deleteInterview({event_id}, headers);
            getInterviews(currentNode.id, jobbank_filters)
            message.success('Evento eliminado')
        } catch (e) {
            console.log(e)
            let error = e.response?.data?.message;
            let msg = error ? error : 'Evento no eliminado';
            message.error(msg)
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

    const closeModalDelete = () =>{
        setItemToDelete([]);
        setOpenModalDelete(false)
    }

    const showModalDelete = () =>{
        setOpenModalDelete(true)
        closeModalDetail()
    }

    const showModalForm = () =>{
        setOpenModalForm(true)
        closeModalDetail()
    }

    const showModalDetails = (item) =>{
        setItemToDetail(item)
        setItemToEdit(item)
        setItemToDelete([item])
        setOpenModalDetail(true)
    }

    const disabledDate = (value) =>{
        let type = router.query?.type ?? 'month';
        if(type == 'year') return false;
        let mth = value.format('MM');
        let current = router.query?.mth
            ? parseInt(router.query?.mth)
            : currentMonth;
        return parseInt(mth) != current;
    }

    const classOpen = useMemo(()=>{
        let valid = router.query?.view == 'calendar' || !router.query?.view;
        return valid ? 'open' : 'close';
    },[router.query?.view])

    const getHeader = e => <CalendarHeader {...e}/>;
    const getCell = e => <CalendarDateCell {...{showModalDetails, value: e}}/>;
    const getMonth = e => <CalendarMonthCell date={e}/>;

    return (
        <>
            <Spin spinning={load_interviews}>
                <Calendar
                    className={`calendar-interviews ${classOpen}`}
                    headerRender={getHeader}
                    dateCellRender={getCell}
                    monthCellRender={getMonth}
                    mode={router.query?.type ?? 'month'}
                    disabledDate={disabledDate}
                />
                {router.query?.view == 'schedule' &&
                    <MonthDetails showModalDetails={showModalDetails}/>
                }
            </Spin>
            <EventDetails
                itemToDetail={itemToDetail}
                close={closeModalDetail}
                visible={openModalDetail}
                showModalForm={()=> fetchAction(showModalForm, itemToEdit)}
                showModalDelete={()=> fetchAction(showModalDelete, itemToDelete[0])}
            />
            <EventForm
                visible={openModalForm}
                close={closeModalForm}
                itemToEdit={itemToEdit}
                actionForm={actionUpdate}
            />
            <ListItems
                title='¿Estas seguro de eliminar este evento?'
                visible={openModalDelete}
                itemsToList={itemToDelete}
                close={closeModalDelete}
                keyTitle='all_data_response, summary'
                keyDescription='process_selection, vacant, job_position'
                actionConfirm={actionDelete}
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