import React, { useState, useEffect } from 'react';
import { List, Empty, Avatar, message } from 'antd';
import {
    CardInfo,
    CardItem,
    CardScroll
} from './Styled';
import {
    ReloadOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import WebApiPeople from '../../api/WebApiPeople';
import {
    getFullName,
    getPhoto
} from '../../utils/functions';
import moment from 'moment';
import {
    injectIntl,
    FormattedMessage
} from 'react-intl';
import ModalInfoRequest from '../comunication/requets/ModalInfoRequest';

const WidgetRequests = () => {

    const {
        user,
        current_node
    } = useSelector(state => state.userStore);
    
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);

    const [itemRequest, setItemRequest] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    useEffect(() => {
        if (!current_node) return;
        getRequests()
    }, [current_node])

    const onFinishCancel = async (values) => {
        try {
            let body = { ...values, id: itemRequest?.id, khonnect_id: user?.khonnect_id };
            await WebApiPeople.vacationCancelRequest(body);
            message.success('Solicitud cancelada')
            getRequests()
        } catch (e) {
            console.log(e)
            message.error('Solicitud no cancelada')
        }
    }

    const onFinishReject = async (values) => {
        try {
            let body = { ...values, id: itemRequest?.id, khonnect_id: user?.khonnect_id };
            await WebApiPeople.vacationRejectRequest(body);
            message.success('Solicitud rechazada')
            getRequests()
        } catch (e) {
            console.log(e)
            message.error('Solicitud no rechazada')
        }
    }

    const onFinishApprove = async () => {
        try {
            let body = {id: itemRequest?.id, khonnect_id: user?.khonnect_id };
            await WebApiPeople.vacationApproveRequest(body);
            message.success('Solicitud aprobada')
            getRequests()
        } catch (e) {
            console.log(e)
            message.error('Solicitud no aprobada')
        }
    }

    const getRequests = async () => {
        try {
            setLoading(true)
            let query = `&status=1&immediate_supervisor=${user.id}`;
            let response = await WebApiPeople.getVacationRequest(current_node?.id, query);
            setRequests(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setRequests([])
        }
    }


    const getDescriptionRequests = (item) => {
        let start = moment(item?.departure_date, formatStart).format(formatEnd);
        let end = moment(item?.return_date, formatStart).format(formatEnd);
        return `Días: ${item?.days_requested}, Fechas: ${start} - ${end}`;
    }

    const showModal = (item) => {
        setOpenModal(true)
        setItemRequest(item)
    }
    
    const closeModal = () =>{
        setOpenModal(false)
        setItemRequest({})
    }

    const actionFormModal = {
        cancel: onFinishCancel,
        reject: onFinishReject,
        approve: onFinishApprove
    }

    const Void = (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={'nodata'} />} />
    )

    return (
        <>
            <CardInfo>
                <CardItem jc='center' hg='100%' pd='16px 0px'
                    ai={requests?.length > 0 ? 'flex-start' : 'center'}
                    title={<>
                        <img src='/images/requests.png' />
                        <p>Solicitudes pendientes</p>
                    </>}
                    extra={<>{requests?.length ?? 0}</>}
                >
                    {!loading ?
                        <CardScroll className="scroll-bar">
                            <List
                                size="small"
                                itemLayout="horizontal"
                                dataSource={requests}
                                locale={{ emptyText: Void }}
                                renderItem={(item, idx) => (
                                    <List.Item key={idx}>
                                        <List.Item.Meta
                                            avatar={<Avatar size='large' src={getPhoto(item?.collaborator, '/images/profile-sq.jpg')} />}
                                            title={<a onClick={() => showModal(item)}>{getFullName(item?.collaborator)}</a>}
                                            description={getDescriptionRequests(item)}
                                        />
                                    </List.Item>
                                )}
                            />
                        </CardScroll>
                        : <ReloadOutlined className="card-load" spin />
                    }
                </CardItem>
            </CardInfo>
            <ModalInfoRequest
                visible={openModal}
                close={closeModal}
                itemRequest={itemRequest}
                actionForm={actionFormModal}
            />
        </>
    )
}

export default WidgetRequests