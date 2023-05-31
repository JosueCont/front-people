import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getFullName, getPhoto, getValueFilter } from '../../../utils/functions';
import WebApiPeople from '../../../api/WebApiPeople';
import ModalRequests from '../ModalRequests';
import ListItems from '../../../common/ListItems';
import { message, Spin } from 'antd';
import { optionsStatusPermits } from '../../../utils/constant';
import {
    Card,
    Row,
    Col,
    Button,
    Form,
    Image
} from 'antd';
import moment from 'moment';
import PermitForm from './PermitForm';

const InfoPermission = () => {

    const getUser = state => state.userStore.user;
    const current_user = useSelector(getUser);

    const noValid = [undefined, null, "", " "];

    const router = useRouter();
    const [formPermit] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentPerson, setCurrentPerson] = useState({});

    const [infoPermit, setInfoPermit] = useState({});
    const [statusSelected, setStatusSelected] = useState(2);

    const [openModal, setOpenModal] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    useEffect(() => {
        if (router?.query?.id) {
            getInfoPermit(router.query?.id)
        }
    }, [router.query?.id])

    useEffect(() => {
        if (Object.keys(infoPermit).length > 0) {
            formPermit.setFieldsValue()
            setValuesForm()
        }
    }, [infoPermit])

    const getInfoPermit = async (id) => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getInfoPermit(id);
            setInfoPermit(response.data)
            setCurrentPerson(response.data?.collaborator)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const onFinish = async (values = {}) => {
        try {
            setLoading(true)
            let body = { ...values, status: statusSelected,
                id: router.query?.id, khonnect_id: current_user?.khonnect_id
            };
            let response = await WebApiPeople.changeStatusPermitsRequest(body);
            let msg = statusSelected == 2
                ? 'Solicitud aprobada'
                : 'Solicitud rechazada';
            message.success(msg)
            setInfoPermit(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            let msg = statusSelected == 2
                ? 'Solicitud no aprobada'
                : 'Solicitud no rechazada';
            message.error(msg)
        }
    }

    const setValuesForm = () => {
        let values = {};
        values.status = !noValid.includes(infoPermit?.status) ? getStatus(infoPermit?.status) : null;
        values.person = infoPermit?.collaborator ? getFullName(infoPermit?.collaborator) : null;
        values.departure_date = infoPermit?.departure_date
            ? moment(infoPermit.departure_date, formatStart).format(formatEnd) : null;
        values.return_date = infoPermit?.return_date
            ? moment(infoPermit.return_date, formatStart).format(formatEnd) : null;
        values.requested_days = !noValid.includes(infoPermit?.requested_days)
            ? infoPermit?.requested_days : null;
        values.reason = infoPermit?.reason ? infoPermit?.reason : null;
        formPermit.setFieldsValue(values)
    }

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusPermits,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const actionBack = () => {
        router.push('/comunication/requests/permission')
    }

    const showModal = () => {
        setOpenModal(true)
        setStatusSelected(3) //Rechazado
    }

    const showConfirm = () => {
        setOpenConfirm(true)
        setStatusSelected(2) //Aprobado
    }

    const closeModal = () => {
        setOpenModal(false)
        setStatusSelected(3)
    }

    const closeConfirm = () => {
        setOpenConfirm(false)
        setStatusSelected(2)
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
                                form={formPermit}
                                layout='vertical'
                            >
                                <PermitForm
                                    showConfirm={showConfirm}
                                    showModal={showModal}
                                    infoPermit={infoPermit}
                                />
                            </Form>
                        </Spin>
                    </Col>
                </Row>
            </Card>
            <ModalRequests
                title='Rechazar solicitud de permisos'
                visible={openModal}
                close={closeModal}
                actionForm={onFinish}
                textAction='Rechazar'
            />
            <ListItems
                visible={openConfirm}
                title='¿Estás seguro de aprobar la siguiente solicitud de permisos?'
                actionConfirm={onFinish}
                textConfirm='Aprobar'
                close={closeConfirm}
                showList={false}
            />
        </>
    )
}

export default InfoPermission