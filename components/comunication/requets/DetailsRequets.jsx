import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import VacactionForm from './VacactionForm';
import { useSelector } from 'react-redux';
import { getPhoto } from '../../../utils/functions';
import WebApiPeople from '../../../api/WebApiPeople';
import { message, Spin } from 'antd';
import {
    Card,
    Row,
    Col,
    Button,
    Form,
    Image
} from 'antd';
import moment from 'moment';

const DetailsRequets = ({
    action,
    isAdmin,
    newFilters
}) => {

    const {
        current_node,
        user,
        general_config
    } = useSelector(state => state.userStore);
    const router = useRouter();
    const [formRequest] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentPerson, setCurrentPerson] = useState({});
    const [infoRequest, setInfoRequest] = useState({});
    // Keys
    const period = 'current_vacation_period';

    useEffect(()=>{
        if(user && action  == 'add' && !isAdmin){
            setCurrentPerson(user)
            formRequest.setFieldsValue({
                person: user?.id,
                immediate_supervisor: user?.immediate_supervisor?.id
            })
        }
    },[user])

    useEffect(() => {
        if (router?.query?.id && action == 'edit') {
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
            setInfoRequest(response.data)
            setCurrentPerson(response.data?.collaborator)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const onFinishCreate = async (values) => {
        try {
            let body = { ...values, node: current_node?.id }
            const SaveRequest = values?.period == currentPerson[period]
                ? WebApiPeople.saveVacationRequest
                : WebApiPeople.vacationNextPeriod;
            let response = await SaveRequest(body);
            // formRequest.resetFields();
            // setLoading(false)
            message.success('Solicitud registrada')
            actionBack()
        } catch (e) {
            console.log(e)
            setLoading(false)
            message.error('Solicitud no registrada')
        }
    }

    const onFinishUpdate = async (values) => {
        try {
            let response = await WebApiPeople.updateVacationRequest(router.query?.id, values);
            setInfoRequest(response.data)
            setLoading(false)
            message.success('Solicitud actualizada')
        } catch (e) {
            setLoading(false)
            console.log(e)
            message.error('Solicitud no actualizada')
        }
    }

    const setValuesForm = () => {
        let values = {...infoRequest};
        values.person = infoRequest?.collaborator ? infoRequest.collaborator?.id : null;
        values.departure_date = infoRequest?.departure_date
            ? moment(infoRequest.departure_date, 'YYYY-MM-DD') : null;
        values.return_date = infoRequest?.return_date
            ? moment(infoRequest.return_date, 'YYYY-MM-DD') : null;
        values.availableDays = infoRequest?.available_days_vacation
            ? infoRequest?.available_days_vacation : null;
        values.immediate_supervisor = infoRequest?.immediate_supervisor
            ? infoRequest.immediate_supervisor?.id : null;
        formRequest.setFieldsValue(values)
    }

    const onFinish = (values) => {        
        setLoading(true)
        values.created_from = 2; // 2 es que se hizo desde la web
        values.current_available_days = values.availableDays // Dias disponibles al momento de la solicitud
        values.departure_date = values.departure_date
            ? values.departure_date?.format('YYYY-MM-DD') : null;
        values.return_date = values.return_date
            ? values.return_date?.format('YYYY-MM-DD') : null;        
        const actions = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actions[action](values)
    }

    const actionBack = () => {
        let url = isAdmin
            ? '/comunication/requests/holidays'
            : '/user/requests/holidays';
        router.push({
            pathname: url,
            query: newFilters
        })
    }

    return (
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
                                {action == 'add'
                                    ? 'Registrar nueva solicitud'
                                    : 'Información de la solicitud'
                                }
                            </p>
                            <p style={{ marginBottom: 0 }}>
                                Fecha de ingreso:&nbsp;
                                {currentPerson?.date_of_admission
                                    ? moment(currentPerson?.date_of_admission, 'YYYY-MM-DD').format('DD-MM-YYYY')
                                    : 'No disponible'
                                }
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
                            onFinish={onFinish}
                        >
                            <VacactionForm
                                currentPerson={currentPerson}
                                setCurrentPerson={setCurrentPerson}
                                formRequest={formRequest}
                                action={action}
                                actionBack={actionBack}
                                isAdmin={isAdmin}
                            />
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </Card>
    )
}

export default DetailsRequets