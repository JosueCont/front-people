import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import RequestsForm from './RequestsForm';
import { useSelector } from 'react-redux';
import { getFullName, getPhoto, getValueFilter } from '../../../utils/functions';
import WebApiPeople from '../../../api/WebApiPeople';
import ModalRequests from './ModalRequests';
import ListItems from '../../../common/ListItems';
import { message, Spin, Modal } from 'antd';
import { optionsStatusVacation } from '../../../utils/constant';
import {
    Card,
    Row,
    Col,
    Button,
    Form,
    Image
} from 'antd';
import moment from 'moment';

const InfoRequests = () => {
    
    const getUser = state => state.userStore.user;
    const current_user = useSelector(getUser);

    const router = useRouter();
    const refSubmit = useRef(null);
    const [formRequest] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentPerson, setCurrentPerson] = useState({});
    const [infoRequest, setInfoRequest] = useState({});
    const [status, setStatus] = useState(null);

    const [typeModal, setTypeModal] = useState('cancel');
    const [openModal, setOpenModal] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    useEffect(() => {
        if (router?.query?.id) {
            getInfoRequest(router.query?.id)
        }
    }, [router.query?.id])

    useEffect(() => {
        if (Object.keys(infoRequest).length > 0) {
            formRequest.setFieldsValue()
            setValuesForm()
        }
    }, [infoRequest])

    const getInfoRequest = async (id) => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getInfoVacation(id);
            console.log("🚀 ~ file: InfoRequests.jsx:58 ~ getInfoRequest ~ response:", response)
            setInfoRequest(response.data)
            setStatus(response.data?.status)
            getPerson(response.data?.collaborator?.id)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const getPerson = async (id) =>{
        try {
            let response = await WebApiPeople.getPerson(id);
            setCurrentPerson(response.data)
        } catch (e) {
            console.log(e)
            setCurrentPerson({})
        }
    }

    const onFinishCancel = async (values) => {
        try {
            setLoading(true)
            let body = {...values, id: router.query?.id, khonnect_id: current_user?.khonnect_id};
            let response = await WebApiPeople.vacationCancelRequest(body);
            setTimeout(()=>{
                setLoading(false)
                onSuccess({message: 'Solicitud cancelada'})
            },1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Solicitud no cancelada')
        }
    }

    const onFinishReject = async (values) => {
        try {
            setLoading(true)
            let body = {...values, id: router.query?.id, khonnect_id: current_user?.khonnect_id};
            let response = await WebApiPeople.vacationRejectRequest(body);
            setTimeout(()=>{
                setLoading(false)
                onSuccess({message: 'Solicitud rechazada'})
            },1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Solicitud no rechazada')
        }
    }

    const onFinishApprove = async () => {
        try {
            setLoading(true)
            let body = {id: router.query?.id, khonnect_id: current_user?.khonnect_id};
            let response = await WebApiPeople.vacationApproveRequest(body);
            setTimeout(()=>{
                setLoading(false)
                onSuccess({message: 'Solicitud aprobada'})
            },1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Solicitud no aprobada')
        }
    }

    const onFinishReopen = async () =>{
        try {
            setLoading(true)
            let body = {id: router.query?.id, khonnect_id: current_user?.khonnect_id};
            let response = await WebApiPeople.vacationReOpenRequest(body);
            setTimeout(()=>{
                setLoading(false)
                onSuccess({message: response.data?.message})
            },1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Solicitud no reabierta')
        }
    }

    const onSuccess = ({
        message = ''
    }) =>{
        Modal.success({
            keyboard: false,
            maskClosable: false,
            title: message,
            okText: 'Aceptar',
            onOk() {
                router.push('/comunication/requests/holidays');
            }
        })
    }

    const setValuesForm = () => {
        let values = {};
        values.status = infoRequest?.status ? getStatus(infoRequest?.status) : null;
        values.person = infoRequest?.collaborator ? getFullName(infoRequest?.collaborator) : null;
        values.period = infoRequest?.period ? infoRequest.period : null;
        values.departure_date = infoRequest?.departure_date
            ? moment(infoRequest.departure_date, formatStart).format(formatEnd) : null;
        values.return_date = infoRequest?.return_date
            ? moment(infoRequest.return_date, formatStart).format(formatEnd) : null;
        values.days_requested = infoRequest?.days_requested
            ? infoRequest?.days_requested : null;
        values.availableDays = infoRequest?.available_days_vacation
            ? infoRequest?.available_days_vacation : null;
        values.immediate_supervisor = infoRequest?.immediate_supervisor
            ? getFullName(infoRequest.immediate_supervisor) : null;
        formRequest.setFieldsValue(values)
    }

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusVacation,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const actionBack = () => {
        router.push('/comunication/requests/holidays')
    }

    const showModal = (type) => {
        setTypeModal(type)
        setOpenModal(true)
    }

    const showConfirm = (type) =>{
        setTypeModal(type)
        setOpenConfirm(true)
    }

    const closeModal = () => {
        setTypeModal('cancel')
        setOpenModal(false)
    }

    const closeConfirm = () =>{
        setOpenConfirm(false)
        setTypeModal('cancel')
    }

    const actionFormModal = {
        cancel: onFinishCancel,
        reject: onFinishReject,
        approve: onFinishApprove,
        reopen: onFinishReopen
    }

    const textActionModal = {
        cancel: 'Cancelar',
        reject: 'Rechazar y notificar',
        approve: 'Aprobar y notificar',
        reopen: 'Reabrir'
    }

    const titleModal = {
        cancel: 'Cancelar solicitud de vacaciones',
        reject: 'Rechazar solicitud de vacaciones',
        approve: '¿Estás seguro aprobar la siguiente solicitud de vacaciones?',
        reopen: '¿Estás seguro de reabrir la siguiente solicitud aprobada de vacaciones?'
    }

    return (
        <>
            <Card bodyStyle={{ padding: 18 }}>
                <Row gutter={[16, 16]}>
                    <Col span={24} className='title-action-content title-action-border'>
                        <div className='content_title_requets'>
                            <Image
                                src={getPhoto(currentPerson, '/images/fallback.png')}
                                preview={false}
                            />
                            <div className='content_title_requets_text'>
                                <p className='title-action-text'>
                                    Detalle de la solicitud
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={() => actionBack()}
                            disabled={loading}
                            icon={<ArrowLeftOutlined />}
                        >
                            Regresar
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Spin spinning={loading}>
                            <Form
                                form={formRequest}
                                layout='vertical'
                            >
                                <RequestsForm
                                    actionBack={actionBack}
                                    refSubmit={refSubmit}
                                    showModal={showModal}
                                    showConfirm={showConfirm}
                                    status={status}
                                />
                            </Form>
                        </Spin>
                    </Col>
                </Row>
            </Card>
            <ModalRequests
                title={titleModal[typeModal]}
                visible={openModal}
                close={closeModal}
                actionForm={actionFormModal[typeModal]}
                textAction={textActionModal[typeModal]}
            />
            <ListItems
                visible={openConfirm}
                title={titleModal[typeModal]}
                actionConfirm={actionFormModal[typeModal]}
                textConfirm={textActionModal[typeModal]}
                close={closeConfirm}
                textCancel='Cerrar'
                showList={false}
            />
        </>
    )
}

export default InfoRequests