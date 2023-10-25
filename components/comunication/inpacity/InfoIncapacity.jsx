import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getFullName, getPhoto, getValueFilter } from '../../../utils/functions';
import WebApiPeople from '../../../api/WebApiPeople';
import ModalRequests from '../ModalRequests';
import ListItems from '../../../common/ListItems';
import { message, Spin } from 'antd';
import {
    optionsStatusPermits,
    optionsClasifIMSS,
    optionsCategoryIMSS,
    optionsSubcategoryIMSS
} from '../../../utils/constant';
import {
    Card,
    Row,
    Col,
    Button,
    Form,
    Image
} from 'antd';
import moment from 'moment';
import InabilityForm from './InabilityForm';

const InfoIncapacity = () => {

    const getUser = state => state.userStore.user;
    const current_user = useSelector(getUser);

    const noValid = [undefined, null, "", " "];

    const router = useRouter();
    const [formInability] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentPerson, setCurrentPerson] = useState({});
    const [infoInability, setInfoInability] = useState({});

    const [openModal, setOpenModal] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    useEffect(() => {
        if (router?.query?.id) {
            getInfoInability(router.query?.id)
        }
    }, [router.query?.id])

    useEffect(() => {
        if (Object.keys(infoInability).length > 0) {
            formInability.setFieldsValue()
            setValuesForm()
        }
    }, [infoInability])

    const getInfoInability = async (id) => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getInfoInability(id);
            setInfoInability(response.data)
            setCurrentPerson(response.data?.person)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const onFinishReject = async (values) => {
        try {
            setLoading(true)
            let body = { ...values, id: router.query?.id, khonnect_id: current_user?.khonnect_id };
            await WebApiPeople.rejectDisabilitiesRequest(body);
            message.success('Solicitud rechazada')
            getInfoInability(router.query?.id)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Solicitud no rechazada')
        }
    }

    const onFinishApprove = async () => {
        try {
            setLoading(true)
            let body = { id: router.query?.id, khonnect_id: current_user?.khonnect_id };
            await WebApiPeople.approveDisabilitiesRequest(body);
            message.success('Solicitud aprobada')
            getInfoInability(router.query?.id)
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Solicitud no aprobada')
        }
    }

    const setValuesForm = () => {
        let values = {};
        values.person = infoInability?.person ? getFullName(infoInability?.person) : null;
        values.status = !noValid.includes(infoInability?.status) ? getStatus(infoInability?.status) : null;
        values.incapacity_type = infoInability?.incapacity_type
            ? infoInability?.incapacity_type?.description : null;

        values.imss_classification = !noValid.includes(infoInability?.imss_classification)
            ? getClasif(infoInability?.imss_classification)
            : null;

        values.category = !noValid.includes(infoInability?.category)
            ? getCategory(infoInability?.category) : null;
        values.subcategory = !noValid.includes(infoInability?.subcategory)
            ? getSubcategory(infoInability?.subcategory) : null;

        values.departure_date = infoInability?.departure_date
            ? moment(infoInability.departure_date, formatStart).format(formatEnd) : null;
        values.return_date = infoInability?.return_date
            ? moment(infoInability.return_date, formatStart).format(formatEnd) : null;
        values.payroll_apply_date = infoInability.payroll_apply_date
            ? moment(infoInability?.payroll_apply_date, formatStart).format(formatEnd) : null;

        values.requested_days = infoInability?.requested_days;
        values.invoice = infoInability?.invoice;
        values.document_name_read = infoInability?.document
            ? infoInability.document?.split('/')?.at(-1) : null;

        formInability.setFieldsValue(values)
    }

    const getClasif = (value) => getValueFilter({
        value,
        list: optionsClasifIMSS,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getCategory = (value) => getValueFilter({
        value,
        list: optionsCategoryIMSS,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getSubcategory = (value) => getValueFilter({
        value,
        list: optionsSubcategoryIMSS,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const getStatus = (value) => getValueFilter({
        value,
        list: optionsStatusPermits,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const actionBack = () => {
        router.push('/comunication/requests/incapacity')
    }

    const showModal = () => {
        setOpenModal(true)
    }

    const showConfirm = () => {
        setOpenConfirm(true)
    }

    const closeModal = () => {
        setOpenModal(false)
    }

    const closeConfirm = () => {
        setOpenConfirm(false)
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
                                form={formInability}
                                layout='vertical'
                            >
                                <InabilityForm
                                    showConfirm={showConfirm}
                                    showModal={showModal}
                                    infoInability={infoInability}
                                />
                            </Form>
                        </Spin>
                    </Col>
                </Row>
            </Card>
            <ModalRequests
                title='Rechazar solicitud de incapacidad'
                visible={openModal}
                close={closeModal}
                actionForm={onFinishReject}
                textAction='Rechazar'
            />
            <ListItems
                visible={openConfirm}
                title='¿Estás seguro de aprobar la siguiente solicitud de incapacidad?'
                actionConfirm={onFinishApprove}
                textConfirm='Aprobar'
                close={closeConfirm}
                showList={false}
            />
        </>
    )
}

export default InfoIncapacity