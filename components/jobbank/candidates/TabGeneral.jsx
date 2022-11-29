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
import { ToTopOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { redirectTo } from '../../../utils/constant';

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
    const inputFile = useRef(null);
    const [formCandidate] = Form.useForm();
    const [infoCandidate, setInfoCandidate] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [actionType, setActionType] = useState('');
    const [fileCV, setFileCV] = useState([]);
    const [nameCV, setNameCV] = useState('');

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
        let name = infoCandidate.cv ? infoCandidate.cv.split('/').at(-1) : '';
        setNameCV(name);
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
            let response = await WebApiJobBank.createCandidate(values);
            message.success('Candidato registrado');
            actionSaveAnd(response.data.id);
        } catch (e) {
            console.log(e);
            setFetching(false);
            setLoading({})
            message.error('Candidato no registrado')
        }
    }

    const createData = (obj) =>{
        let dataCandidate = new FormData();
        dataCandidate.append('node', currentNode.id);
        Object.entries(obj).map(([key, val])=>{ if(val) dataCandidate.append(key, val) });
        if(fileCV.length > 0) dataCandidate.append('cv', fileCV[0]);
        return dataCandidate;
    }

    const onFinish = (values) =>{
        const body = createData(values);
        setFetching(true);
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](body);
    }

    const getNewFilters = () =>{
        let newFilters = {...router.query};
        if(newFilters.id) delete newFilters.id;
        return newFilters;
    }

    const actionBack = () =>{
        let filters = getNewFilters();
        router.push({
            pathname: '/jobbank/candidates',
            query: filters
        })
    }

    const actionCreate = () =>{
        formCandidate.resetFields();
        setFetching(false);
        setLoading({});
        setFileCV([]);
        setNameCV('')
    }

    const actionEdit = (id) =>{
        let filters = getNewFilters();
        router.replace({
            pathname: '/jobbank/candidates/edit',
            query: {...filters, id }
        })
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: actionEdit,
            default: () => router.replace({
                pathname: `/jobbank/${router.query.uid}/candidate/`,
                query: { id }
            }, undefined, { shallow: true })
        }
        let selected = isAutoRegister ? 'default' : actionType;
        actionFunction[selected](id);
    }

    const getSaveAnd = (type) =>{
        setActionType(type)
        const item = { loading: true, disabled: false };
        setLoading({...fetchingParams, [type]: item });
        btnSave.current.click();
    }

    const setFileSelected = ({target : { files }}) =>{
        if(Object.keys(files).length <= 0) return false;
        setNameCV(files[0].name);
        setFileCV([files[0]]);
    }

    const openFile = () =>{
        inputFile.current.value = null;
        inputFile.current.click();
    }

    const resetCV = () =>{
        setFileCV([]);
        setNameCV('')
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
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='fisrt_name'
                                    label='Nombre'
                                    rules={[ruleRequired, ruleWhiteSpace]}
                                >
                                    <Input maxLength={150} placeholder='Nombre del candidato'/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='last_name'
                                    label='Apellidos'
                                    rules={[ruleWhiteSpace]}
                                >
                                    <Input maxLength={150} placeholder='Apellidos del candidato'/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='email'
                                    label='Correo'
                                    rules={[ruleRequired, ruleEmail]}
                                >
                                    <Input maxLength={150} placeholder='Correo'/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='cell_phone'
                                    label='Teléfono celular'
                                    rules={[rulePhone, ruleRequired]}
                                >
                                    <Input maxLength={10} placeholder='Teléfono celular'/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='telephone'
                                    label='Teléfono fijo'
                                    rules={[rulePhone]}
                                >
                                    <Input maxLength={10} placeholder='Teléfono fijo'/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='location'
                                    label='Localidad'
                                    rules={[ruleWhiteSpace]}
                                >
                                    <Input maxLength={300} placeholder='Localidad'/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='street_address'
                                    label='Dirección'
                                    rules={[ruleWhiteSpace]}
                                >
                                    <Input placeholder='Dirección'/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='postal_code'
                                    label='Código postal'
                                    rules={[onlyNumeric]}
                                >
                                    <Input maxLength={10} placeholder='Código postal'/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label='CV'
                                >
                                    <Input.Group compact>
                                        <Input
                                            style={{
                                                width: `calc(100% - 64px)`,
                                                borderTopLeftRadius: 10,
                                                borderBottomLeftRadius: 10
                                            }}
                                            value={nameCV}
                                            placeholder='Archivo seleccionado'
                                        />
                                        {infoCandidate.cv ? (
                                            <Button
                                                className='custom-btn'
                                                onClick={()=> redirectTo(infoCandidate.cv, true)}
                                                icon={<EyeOutlined />}
                                            />
                                        ): (
                                            <Button
                                                className='custom-btn'
                                                onClick={()=> resetCV()}
                                                icon={<DeleteOutlined />}
                                            />
                                        )}
                                        <Button
                                            icon={<ToTopOutlined />}
                                            onClick={()=> openFile()}
                                            style={{
                                                borderTopRightRadius: 10,
                                                borderBottomRightRadius: 10
                                            }}
                                        />
                                        <input
                                            type='file'
                                            style={{display: 'none'}}
                                            ref={inputFile}
                                            onChange={setFileSelected}
                                        />
                                    </Input.Group>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
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
                            {/* <Col xs={24} md={12} xl={8} xxl={6}>
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