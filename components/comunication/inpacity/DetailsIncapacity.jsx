import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftOutlined } from '@ant-design/icons';
import IncapacityForm from './IncapacityForm';
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

const DetailsIncapacity = ({
    action
}) => {

    const router = useRouter();
    const noValid = [undefined, null, '', ' '];

    const [formIncapacity] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [currentPerson, setCurrentPerson] = useState({});
    const [infoIncapacity, setInfoIncapacity] = useState({});
    const [fileDocument, setFileDocument] = useState([]);

    useEffect(() => {
        if (router?.query?.id && action == 'edit') {
            getInfoIncapacity(router.query?.id)
        }
    }, [router.query?.id])

    useEffect(() => {
        if (Object.keys(infoIncapacity).length > 0) {
            formIncapacity.setFieldsValue()
            setValuesForm()
        }
    }, [infoIncapacity])

    const getInfoIncapacity = async (id) => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getInfoInability(id);
            setInfoIncapacity(response.data)
            setCurrentPerson(response.data?.person)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const onFinishCreate = async (values) => {
        try {
            await WebApiPeople.saveDisabilitiesRequest(values);
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
            let response = await WebApiPeople.updateDisabilitiesRequest(router.query?.id, values);
            setInfoIncapacity(response.data)
            setLoading(false)
            setFileDocument([])
            message.success('Solicitud actualizada')
        } catch (e) {
            setLoading(false)
            console.log(e)
            message.error('Solicitud no actualizada')
        }
    }

    const setValuesForm = () => {
        let values = {};
        values.person = infoIncapacity?.person ? infoIncapacity.person?.id : null;
        values.invoice = infoIncapacity?.invoice ? infoIncapacity?.invoice : null;
        values.incapacity_type = infoIncapacity?.incapacity_type
            ? infoIncapacity?.incapacity_type?.id : null;
        values.imss_classification = infoIncapacity?.imss_classification;
        values.category = infoIncapacity?.category;
        values.subcategory = infoIncapacity?.subcategory;
        values.requested_days = infoIncapacity?.requested_days;
        values.departure_date = infoIncapacity?.departure_date
            ? moment(infoIncapacity.departure_date, 'YYYY-MM-DD') : null;
        values.return_date = infoIncapacity?.return_date
            ? moment(infoIncapacity.return_date, 'YYYY-MM-DD') : null;
        values.payroll_apply_date = infoIncapacity.payroll_apply_date
            ? moment(infoIncapacity?.payroll_apply_date, 'YYYY-MM-DD') : null;
        values.document_name_read = infoIncapacity?.document
            ? infoIncapacity.document?.split('/')?.at(-1) : null;
        formIncapacity.setFieldsValue(values)
    }

    const createData = (values) => {
        let dataIncapacity = new FormData();
        if (fileDocument?.length > 0) dataIncapacity.append('document', fileDocument[0]);
        Object.entries(values).map(([key, val]) => {
            let value = noValid.includes(val) ? "" : val;
            dataIncapacity.append(key, value);
        })
        return dataIncapacity;
    }

    const onFinish = (values) => {
        setLoading(true)
        values.departure_date = values.departure_date
            ? values.departure_date?.format('YYYY-MM-DD') : null;
        values.return_date = values.return_date
            ? values.return_date?.format('YYYY-MM-DD') : null;
        values.payroll_apply_date = values.payroll_apply_date
            ? values.payroll_apply_date?.format('YYYY-MM-DD') : null;

        let body = createData(values);
        const actions = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actions[action](body)
    }

    const actionBack = () => {
        router.push('/comunication/requests/incapacity')
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
                            form={formIncapacity}
                            layout='vertical'
                            onFinish={onFinish}
                        >
                            <IncapacityForm
                                currentPerson={currentPerson}
                                setCurrentPerson={setCurrentPerson}
                                formIncapacity={formIncapacity}
                                action={action}
                                actionBack={actionBack}
                                infoIncapacity={infoIncapacity}
                                setFileDocument={setFileDocument}
                            />
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </Card>
    )
}

export default DetailsIncapacity