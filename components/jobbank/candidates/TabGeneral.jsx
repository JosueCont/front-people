import React, { useEffect, useState, useRef } from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Spin,
    message,
    Button,
    Checkbox,
    DatePicker
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
import WebApiJobBank from '../../../api/WebApiJobBank';
import ListLangs from './ListLangs';
import FileUpload from '../FileUpload';
import { optionsGenders } from '../../../utils/constant';
import moment from 'moment';

const TabGeneral = ({
    action,
    currentNode,
    setDisabledTab,
    isAutoRegister,
    newFilters = {},
    setInfoCandidate,
    infoCandidate,
    list_states,
    load_states,
    list_connections_options,
    load_connections_options
}) => {

    const noValid = [undefined, null, '', ' '];
    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const router = useRouter();
    const btnSave = useRef(null);
    const [formCandidate] = Form.useForm();
    const state = Form.useWatch('state', formCandidate);
    const languages = Form.useWatch('languages', formCandidate);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [actionType, setActionType] = useState('');
    const [fileCV, setFileCV] = useState([]);
    const typeFileCV = ['pdf','png','jpg','jpeg','xlsx','docx','pptx','pub'];

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoCandidate(router.query.id);
        }
    },[router.query?.id])

    useEffect(()=>{
        setDisabledTab(true)
        if(Object.keys(infoCandidate).length <= 0) return;
        setValueForm();
    },[infoCandidate])

    const setValueForm = () =>{
        setDisabledTab(false)
        formCandidate.resetFields();
        let values = {...infoCandidate};
        const getLang = item => `${item.lang}-${item.domain}`;
        values.languages = infoCandidate.languages?.length > 0 ? infoCandidate.languages.map(getLang) : [];
        values.cv_name_read = infoCandidate.cv ? infoCandidate.cv.split('/').at(-1) : '';
        values.state = infoCandidate?.state?.id ?? null;
        values.birthdate = infoCandidate.birthdate ? moment(infoCandidate.birthdate) : null;
        values.notification_source = Array.isArray(infoCandidate.notification_source)
            ? infoCandidate.notification_source : [];
        formCandidate.setFieldsValue(values);
    }

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

    const createData = (obj) =>{
        let dataCandidate = new FormData();
        dataCandidate.append('node', currentNode.id);
        dataCandidate.append('auto_register', isAutoRegister);
        if(fileCV.length > 0) dataCandidate.append('cv', fileCV[0]);
        
        const getLang_ = item =>{
            let value = item.split('-');
            return {lang: value[0], domain: value[1]};
        };

        Object.entries(obj).map(([key, val]) => {
            if(key == "languages"){
                let languages = Array.isArray(val) ? val.map(getLang_) : [];
                dataCandidate.append('languages', JSON.stringify(languages));
                return;
            }
            if(key == "notification_source"){
                let codes = Array.isArray(val) ? val : [];
                dataCandidate.append('notification_source', JSON.stringify(codes));
                return;
            }
            let value = noValid.includes(val) ? "" : val;
            dataCandidate.append(key, value);
        });
        
        return dataCandidate;
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

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: ()=> router.push({
                pathname: '/jobbank/candidates',
                query: newFilters
            }),
            create: actionCreate,
            edit: () => router.replace({
                pathname: '/jobbank/candidates/edit',
                query: {...newFilters, id }
            }),
            auto: () => router.replace({
                pathname: `/jobbank/${router.query?.uid}/candidate/`,
                query: { id }
            }, undefined, { shallow: true })
        }
        let selected = isAutoRegister ? 'auto' : actionType;
        actionFunction[selected]();
    }

    const getSaveAnd = (type) =>{
        setActionType(type)
        const item = { loading: true, disabled: false };
        setLoading({...fetchingParams, [type]: item });
        btnSave.current.click();
    }

    const onChangeState = (value) =>{
        if(!value) formCandidate.setFieldsValue({municipality: null});
    }

    const disabledDate = (current) => {
        return current && current > moment().subtract(18,'years').endOf("day");
    };

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
                        <Row gutter={[24,0]}>
                            <Col xs={24} md={12} xl={8} xxl={6} style={{display: 'none'}}>
                                <Form.Item name='is_active' valuePropName='checked'>
                                    <Checkbox>¿Está activo?</Checkbox>
                                </Form.Item>
                            </Col>
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
                                    rules={[ruleRequired, ruleWhiteSpace]}
                                >
                                    <Input maxLength={150} placeholder='Apellidos del candidato'/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='email'
                                    label='Correo electrónico'
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
                                    name='birthdate'
                                    label='Fecha de nacimiento'
                                    rules={[ruleRequired]}
                                    tooltip='Edad mínima requerida 18 años'
                                >
                                    <DatePicker
                                        style={{width: '100%'}}
                                        placeholder='Seleccionar una fecha'
                                        format='DD-MM-YYYY'
                                        defaultPickerValue={moment().subtract(18,'years')}
                                        disabledDate={disabledDate}
                                        inputReadOnly
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='gender'
                                    label='Género'
                                >
                                    <Select
                                        // allowClear
                                        showSearch
                                        placeholder='Seleccionar un género'
                                        notFoundContent='No se encontraron resultados'
                                        optionFilterProp='label'
                                        options={optionsGenders}
                                    />
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
                                    name='state'
                                    label='Estado'
                                    // rules={[rulePhone]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder='Seleccionar un estado'
                                        notFoundContent='No se encontraron resultados'
                                        disabled={load_states}
                                        loading={load_states}
                                        optionFilterProp='children'
                                        onChange={onChangeState}
                                    >
                                        {list_states?.length > 0 && list_states.map(item => (
                                            <Select.Option value={item.id} key={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='municipality'
                                    label='Municipio'
                                    rules={[ruleWhiteSpace]}
                                >
                                    <Input disabled={!state} maxLength={100} placeholder='Especificar el municipio'/>
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
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <FileUpload
                                    label='CV'
                                    keyName='cv_name_read'
                                    tooltip={`Archivos permitidos: ${typeFileCV.join(', ')}.`}
                                    isRequired={true}
                                    download={true}
                                    urlPreview={infoCandidate?.cv}
                                    setFile={setFileCV}
                                    typeFile={typeFileCV}
                                    setNameFile={e => formCandidate.setFieldsValue({
                                        cv_name_read: e
                                    })}
                                />
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    label='¿Disponibilidad para viajar?'
                                    name='availability_to_travel'
                                >
                                    <Select
                                        placeholder='Seleccionar una opción'
                                        notFoundContent='No se encontraron resultados'
                                    >
                                        <Select.Option value={true} key={true}>Sí</Select.Option>
                                        <Select.Option value={false} key={false}>No</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <ListLangs listSelected={languages}/>
                            </Col>
                            <Col xs={24} md={12} xl={8} xxl={6}>
                                <Form.Item
                                    name='notification_source'
                                    label='Recibir notificaciones por'
                                >
                                    <Select
                                        mode='multiple'
                                        maxTagCount={1}
                                        disabled={load_connections_options}
                                        loading={load_connections_options}
                                        placeholder='Seleccionar las opciones'
                                        notFoundContent='No se encontraron resultados'
                                        optionFilterProp='children'
                                    >
                                        <Select.Option value='EM' key='EM'>Correo electrónico</Select.Option>
                                        {list_connections_options.length > 0 &&
                                            list_connections_options.map(item=> (
                                            <Select.Option value={item.code} key={item.code}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
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
        currentNode: state.userStore.current_node,
        list_states: state.jobBankStore.list_states,
        load_states: state.jobBankStore.load_states,
        load_connections_options: state.jobBankStore.load_connections_options,
        list_connections_options: state.jobBankStore.list_connections_options
    }
}


export default connect(mapState)(TabGeneral);