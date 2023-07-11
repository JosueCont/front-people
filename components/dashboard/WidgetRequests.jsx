import React, { useState, useEffect } from 'react';
import { Tabs, List, Empty, Avatar, message, Tag } from 'antd';
import {
    CardInfo,
    CardItem,
    CardScroll,
    ContentTabs
} from './Styled';
import {
    LoadingOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import WebApiPeople from '../../api/WebApiPeople';
import {
    getFullName,
    getPhoto,
    getValueFilter
} from '../../utils/functions';
import moment from 'moment';
import {
    injectIntl,
    FormattedMessage
} from 'react-intl';
import { useRouter } from 'next/router';
import ModalInfoRequest from '../comunication/requets/ModalInfoRequest';
import { optionsStatusVacation } from '../../utils/constant';

const WidgetRequests = () => {

    const {
        user,
        current_node
    } = useSelector(state => state.userStore);
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [requests, setRequests] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [typeAction, setTypeAction] = useState('1');

    const [itemRequest, setItemRequest] = useState({});
    const [openModal, setOpenModal] = useState(false);

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    useEffect(() => {
        if (!current_node) return;
        getRequests()
        getMyRequests()
    }, [current_node])

    const onFinishCancel = async (values, type) => {
        try {
            let body = { ...values, id: itemRequest?.id, khonnect_id: user?.khonnect_id };
            await WebApiPeople.vacationCancelRequest(body);
            message.success('Solicitud cancelada')
            if (type == '1') getMyRequests();
            else getRequests();
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
            let body = { id: itemRequest?.id, khonnect_id: user?.khonnect_id };
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
            let query = `&status__in=1&immediate_supervisor=${user.id}`;
            let response = await WebApiPeople.getVacationRequest(current_node?.id, query);
            setRequests(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setRequests([])
        }
    }

    const getMyRequests = async () => {
        try {
            setFetching(true)
            let query = `&status__in=1,5&person__id=${user.id}`;
            let response = await WebApiPeople.getVacationRequest(current_node?.id, query);
            setMyRequests(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
            setMyRequests([])
        }
    }


    const getDescriptionRequests = (item) => {
        let start = moment(item?.departure_date, formatStart).format(formatEnd);
        let end = moment(item?.return_date, formatStart).format(formatEnd);
        return `Días: ${item?.days_requested}, Estatus: ${getStatus(item)}, Fechas: ${start} - ${end}`;
    }

    const showModal = (item, type) => {
        setOpenModal(true)
        setItemRequest(item)
        setTypeAction(type)
    }

    const closeModal = () => {
        setOpenModal(false)
        setItemRequest({})
        setTypeAction('1')
    }

    const actionFormModal = {
        cancel: onFinishCancel,
        reject: onFinishReject,
        approve: onFinishApprove
    }

    const Void = (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={'nodata'} />} />
    )

    const getStatus = (item) => getValueFilter({
        value: item?.status,
        list: optionsStatusVacation,
        keyEquals: 'value',
        keyShow: 'label'
    })

    return (
        <>
            <CardInfo>
                <CardItem
                    jc='center' hg='100%' pd='0px 0px 16px 0px'
                    title={<>
                        <img src='/images/requests.png' />
                        <p>Solicitudes de vacaciones</p>
                    </>}
                    extra={<a onClick={() => router.push('user/requests/holidays')}>Ver</a>}
                >
                    <ContentTabs>
                        <Tabs type='card' size='small'>
                            <Tabs.TabPane key='1' tab={`Mis solicitudes (${myRequests?.length ?? 0})`}>
                                {!fetching ? (
                                    <CardScroll className="scroll-bar">
                                        <List
                                            size="small"
                                            itemLayout="horizontal"
                                            dataSource={myRequests}
                                            locale={{ emptyText: Void }}
                                            renderItem={(item, idx) => (
                                                <List.Item key={idx}>
                                                    <List.Item.Meta
                                                        avatar={<Avatar size='large' src={getPhoto(item?.collaborator, '/images/profile-sq.jpg')} />}
                                                        title={<a onClick={() => showModal(item, '1')}>Jefe inmediato: {getFullName(item?.immediate_supervisor)}</a>}
                                                        description={getDescriptionRequests(item)}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </CardScroll>
                                ) : <LoadingOutlined className="card-load" spin />}

                            </Tabs.TabPane>
                            <Tabs.TabPane key='2' tab={`Por aprobar (${requests?.length ?? 0})`}>
                                {!loading ? (
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
                                                        title={<a onClick={() => showModal(item, '2')}>{getFullName(item?.collaborator)}</a>}
                                                        description={getDescriptionRequests(item)}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </CardScroll>
                                ) : <LoadingOutlined className="card-load" spin />}
                            </Tabs.TabPane>
                        </Tabs>
                    </ContentTabs>
                </CardItem>
            </CardInfo>
            <ModalInfoRequest
                visible={openModal}
                close={closeModal}
                itemRequest={itemRequest}
                actionForm={actionFormModal}
                actionType={typeAction}
            />
        </>
    )
}

export default WidgetRequests