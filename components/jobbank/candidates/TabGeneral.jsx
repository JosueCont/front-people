import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Form,
    Spin,
    message,
} from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import WebApiJobBank from '../../../api/WebApiJobBank';
import moment from 'moment';
import FormGeneral from './FormGeneral';
import DetailsCustom from '../DetailsCustom';
import { useInfoCandidate } from '../hook/useInfoCandidate';

const TabGeneral = ({
    action,
    setDisabledTab,
    newFilters = {},
    setInfoCandidate,
    infoCandidate,
    actionBack =()=>{}
}) => {
    
    const router = useRouter();
    const [formCandidate] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [actionType, setActionType] = useState('');
    const [fileCV, setFileCV] = useState([]);
    const { createData, setValuesForm } = useInfoCandidate({
        fileCV, isAutoRegister: false
    });

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoCandidate(router.query.id);
        }
    },[router.query?.id])

    useEffect(()=>{
        setDisabledTab(true)
        if(Object.keys(infoCandidate).length <= 0) return;
        setDisabledTab(false)
        formCandidate.resetFields();
        let values = setValuesForm(infoCandidate);
        formCandidate.setFieldsValue(values)
    },[infoCandidate])

    const getInfoCandidate = async (id) =>{
        try {
            setFetching(true);
            let response = await WebApiJobBank.getInfoCandidate(id);
            setInfoCandidate(response.data);
            setFetching(false);
        } catch (e) {
            console.log(e)
            setFetching(false);
        }
    }

    const onFinisUpdate = async (values) =>{
        try {
            let response = await WebApiJobBank.updateCandidate(infoCandidate.id, values);
            getInfoCandidate(response.data.id);
            message.success('Candidato actualizado');
            setFetching(false)
        } catch (e) {
            console.log(e)
            let msgEmail = e.response?.data?.email;
            let msg = msgEmail ? 'Este correo ya existe' : 'Candidato no actualizado';
            message.error(msg);
            setFetching(false)
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            let response = await WebApiJobBank.createCandidate(values);
            message.success('Candidato registrado');
            actionSaveAnd(response.data.id);
        } catch (e) {
            console.log(e);
            setFetching(false);
            setLoading({})
            let msgEmail = e.response?.data?.email;
            let msg = msgEmail ? 'Este correo ya existe' : 'Candidato no registrado';
            message.error(msg);
        }
    }

    const onFinish = (values) =>{
        if(values.birthdate) values.birthdate = values.birthdate?.format('YYYY-MM-DD');
        const body = createData(values);
        setFetching(true);
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](body);
    }

    const onFailed = (e) =>{
        setLoading({})
    }

    const actionCreate = () =>{
        formCandidate.resetFields();
        setFetching(false);
        setLoading({});
        setFileCV([]);
    }

    const actionEdit = (id) => router.replace({
        pathname: '/jobbank/candidates/edit',
        query: {...newFilters, id }
    });

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: actionEdit
        }
        actionFunction[actionType](id);
    }

    return (
        <Row>
            <Col span={24}>
                <Spin spinning={fetching}>
                    <Form
                        id='form-candidates'
                        layout='vertical'
                        form={formCandidate}
                        onFinish={onFinish}
                        onFinishFailed={onFailed}
                        initialValues={{
                            is_active: true,
                            availability_to_travel: false,
                            languages: [],
                            notification_source: []
                        }}
                    >
                        <FormGeneral
                            formCandidate={formCandidate}
                            setFileCV={setFileCV}
                            infoCandidate={infoCandidate}
                        />
                    </Form>
                </Spin>
            </Col>
            <Col span={24} className='tab-vacancies-btns'>
                <DetailsCustom
                    idForm='form-candidates'
                    action={action}
                    onlyOptions={true}
                    fetching={fetching}
                    setLoading={setLoading}
                    loading={loading}
                    setActionType={setActionType}
                />
            </Col>
        </Row>
    )
}

export default TabGeneral;