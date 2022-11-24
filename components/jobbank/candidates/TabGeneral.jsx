import React, { useEffect, useState, useRef } from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Spin,
    message,
    Button
} from 'antd';
import {
    ruleWhiteSpace,
    ruleRequired,
    ruleEmail,
    rulePhone,
    onlyNumeric
} from '../../../utils/rules';
import { connect } from 'react-redux'; 
import { useRouter } from 'next/router';
import { validateNum } from '../../../utils/functions';
import WebApiJobBank from '../../../api/WebApiJobBank';

const TabGeneral = ({
    sizeCol = 8,
    action,
    currentNode,
    setDisabledTab,
    isAutoRegister = false
}) => {

    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const router = useRouter();
    const btnSave = useRef(null);
    const [formCandidate] = Form.useForm();
    const [infoCandidate, setInfoCandidate] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [actionType, setActionType] = useState('');

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoCandidate(router.query.id);
        }
    },[router])

    useEffect(()=>{
        setDisabledTab(true)
        if(Object.keys(infoCandidate).length <= 0) return;
        setDisabledTab(false)
        formCandidate.resetFields();
        formCandidate.setFieldsValue(infoCandidate);
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
            message.error('Candidato no actualizado');
            setFetching(false)
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            let response = await WebApiJobBank.createCandidate({...values, node: currentNode.id});
            message.success('Candidato registrado');
            actionSaveAnd(response.data.id);
        } catch (e) {
            console.log(e);
            setFetching(false);
            message.error('Candidato no registrado')
        }
    }

    const onFinish = (values) =>{
        setFetching(true);
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](values);
    }

    const actionCreate = () =>{
        formCandidate.resetFields();
        setInfoCandidate({});
        setFetching(false);
        setLoading({});
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: () => router.push('/jobbank/candidates'),
            create: actionCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/candidates/edit',
                query: { id }
            }),
            default: () => router.replace({
                pathname: `/jobbank/${router.query.uid}/candidate/`,
                query: { id }
            }, undefined, { shallow: true })
        }
        let selected = isAutoRegister ? 'default' : actionType;
        actionFunction[selected]();
    }

    const getSaveAnd = (type) =>{
        setActionType(type)
        const item = { loading: true, disabled: false };
        setLoading({...fetchingParams, [type]: item });
        btnSave.current.click();
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
                        onFinishFailed={()=> setLoading({})}
                    >
                        <Row gutter={[24,0]}>
                            <Col span={sizeCol}>
                                <Form.Item
                                    name='fisrt_name'
                                    label='Nombre'
                                    rules={[ruleRequired, ruleWhiteSpace]}
                                >
                                    <Input maxLength={150} placeholder='Nombre del candidato'/>
                                </Form.Item>
                            </Col>
                            <Col span={sizeCol}>
                                <Form.Item
                                    name='last_name'
                                    label='Apellidos'
                                    rules={[ruleWhiteSpace]}
                                >
                                    <Input maxLength={150} placeholder='Apellidos del candidato'/>
                                </Form.Item>
                            </Col>
                            <Col span={sizeCol}>
                                <Form.Item
                                    name='email'
                                    label='Correo'
                                    rules={[ruleRequired, ruleEmail]}
                                >
                                    <Input maxLength={150} placeholder='Correo'/>
                                </Form.Item>
                            </Col>
                            <Col span={sizeCol}>
                                <Form.Item
                                    name='cell_phone'
                                    label='Teléfono celular'
                                    rules={[rulePhone, ruleRequired]}
                                >
                                    <Input maxLength={10} placeholder='Teléfono celular'/>
                                </Form.Item>
                            </Col>
                            <Col span={sizeCol}>
                                <Form.Item
                                    name='telephone'
                                    label='Teléfono fijo'
                                    rules={[rulePhone]}
                                >
                                    <Input maxLength={10} placeholder='Teléfono fijo'/>
                                </Form.Item>
                            </Col>
                            <Col span={sizeCol}>
                                <Form.Item
                                    name='location'
                                    label='Localidad'
                                    rules={[ruleWhiteSpace]}
                                >
                                    <Input maxLength={300} placeholder='Localidad'/>
                                </Form.Item>
                            </Col>
                            <Col span={sizeCol}>
                                <Form.Item
                                    name='street_address'
                                    label='Dirección'
                                    rules={[ruleWhiteSpace]}
                                >
                                    <Input placeholder='Dirección'/>
                                </Form.Item>
                            </Col>
                            <Col span={sizeCol}>
                                <Form.Item
                                    name='postal_code'
                                    label='Código postal'
                                    rules={[onlyNumeric]}
                                >
                                    <Input maxLength={10} placeholder='Código postal'/>
                                </Form.Item>
                            </Col>
                            <Col span={sizeCol}>
                                <Form.Item
                                    name='about_me'
                                    label='Acerca de ti'
                                    rules={[ruleWhiteSpace]}
                                >
                                    <Input.TextArea
                                        placeholder='Acerca de ti'
                                        autoSize={{
                                            minRows: 5,
                                            maxRows: 5,
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            {/* <Col span={sizeCol}>
                                <Form.Item
                                    name='date_birth'
                                    label='Fecha de nacimiento'
                                    rules={[ruleRequired]}
                                >
                                    <DatePicker
                                        style={{width: '100%'}}
                                        placeholder='Fecha de nacimiento'
                                        format='YYYY-MM-DD'
                                        inputReadOnly
                                    />
                                </Form.Item>
                            </Col> */}
                        </Row>
                    </Form>
                </Spin>
            </Col>
            <Col span={24} className='tab-vacancies-btns'>
                {action == 'add' && !isAutoRegister ? (
                    <>
                        <button
                            htmlType='submit'
                            form='form-candidates'
                            ref={btnSave}
                            style={{display:'none'}}
                        />
                        <Button
                            onClick={()=>getSaveAnd('back')}
                            disabled={loading['back']?.disabled}
                            loading={loading['back']?.loading}
                        >
                            Guardar y regresar
                        </Button>
                        <Button
                            onClick={()=>getSaveAnd('create')}
                            disabled={loading['create']?.disabled}
                            loading={loading['create']?.loading}
                        >
                            Guardar y registrar otro
                        </Button>
                        <Button
                            onClick={()=>getSaveAnd('edit')}
                            disabled={loading['edit']?.disabled}
                            loading={loading['edit']?.loading}
                        >
                            Guardar y editar
                        </Button>
                    </>
                ):(
                    <Button
                        htmlType='submit'
                        form='form-candidates'
                        loading={fetching}
                    >
                        {isAutoRegister && action == 'add' ? 'Guardar' : 'Actualizar'}
                    </Button>
                )}
            </Col>
        </Row>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}


export default connect(mapState)(TabGeneral);