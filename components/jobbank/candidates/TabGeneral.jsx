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
    Checkbox
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

const TabGeneral = ({
    action,
    currentNode,
    setDisabledTab,
    isAutoRegister,
    newFilters = {},
    setInfoCandidate,
    infoCandidate,
    list_states,
    load_states
}) => {

    const rule_init = {text:'', status:''};
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
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [actionType, setActionType] = useState('');
    const [fileCV, setFileCV] = useState([]);
    const typeFileCV = ['pdf','png','jpg','jpeg','xlsx','docx','pptx','pub'];
    //Idiomas
    const [currentValue, setCurrentValue] = useState([]);
    const [listLangDomain, setListLangDomain] = useState([]);
    const [ruleLanguages, setRuleLanguages] = useState(rule_init);

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
        setCurrentValue([])
        setRuleLanguages(rule_init)
        formCandidate.resetFields();
        const getLang = item => ({lang: item.lang, domain: item.domain});
        let listLanguages = infoCandidate.languages.map(getLang);
        let listLang = infoCandidate.languages?.length > 0 ? listLanguages : [];
        let cv_name_read = infoCandidate.cv ? infoCandidate.cv.split('/').at(-1) : '';
        let state = infoCandidate?.state?.id ?? null;
        setListLangDomain(listLang)
        formCandidate.setFieldsValue({...infoCandidate, cv_name_read, state});
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
        let noValid = [undefined, null, '', ' '];
        let dataCandidate = new FormData();
        dataCandidate.append('node', currentNode.id);
        dataCandidate.append('auto_register', isAutoRegister);
        Object.entries(obj).map(([key, val])=>{
            let value = noValid.includes(val) ? "" : val;
            dataCandidate.append(key, value);
        });
        if(fileCV.length > 0) dataCandidate.append('cv', fileCV[0]);
        dataCandidate.append('languages', JSON.stringify(listLangDomain));
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

    const onFailed = (e) =>{
        setLoading({})
    }

    const actionCreate = () =>{
        formCandidate.resetFields();
        setFetching(false);
        setLoading({});
        setFileCV([]);
        setCurrentValue([])
        setListLangDomain([])
        setRuleLanguages(rule_init)
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
                            availability_to_travel: false
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
                                    <Input disabled={!state} maxLength={300} placeholder='Especificar el municipio'/>
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
                            <Col span={24}>
                                <ListLangs
                                    listLangDomain={listLangDomain}
                                    setListLangDomain={setListLangDomain}
                                    setCurrentValue={setCurrentValue}
                                    currentValue={currentValue}
                                    setRuleLanguages={setRuleLanguages}
                                    ruleLanguages={ruleLanguages}
                                    rule_languages={rule_init}
                                    changeColor={true}
                                />
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
        currentNode: state.userStore.current_node,
        list_states: state.jobBankStore.list_states,
        load_states: state.jobBankStore.load_states
    }
}


export default connect(mapState)(TabGeneral);