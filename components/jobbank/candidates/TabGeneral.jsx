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
import { validateNum } from '../../../utils/functions';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { ToTopOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { redirectTo } from '../../../utils/constant';
import ListLangs from './ListLangs';

const TabGeneral = ({
    sizeCol = 8,
    action,
    currentNode,
    setDisabledTab,
    isAutoRegister = false,
    newFilters = {}
}) => {

    const rule_languages = {text:'', status:''};
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
    const nameCV = Form.useWatch('cv_name_read', formCandidate);
    const [infoCandidate, setInfoCandidate] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [actionType, setActionType] = useState('');
    const [fileCV, setFileCV] = useState([]);
    //Idiomas
    const [currentValue, setCurrentValue] = useState([]);
    const [listLangDomain, setListLangDomain] = useState([]);
    const [ruleLanguages, setRuleLanguages] = useState(rule_languages);

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoCandidate(router.query.id);
        }
    },[router])

    useEffect(()=>{
        setDisabledTab(true)
        if(Object.keys(infoCandidate).length <= 0) return;
        setValueForm();
    },[infoCandidate])

    const setValueForm = () =>{
        setDisabledTab(false)
        setCurrentValue([])
        setRuleLanguages(rule_languages)
        formCandidate.resetFields();
        const getLang = item => ({lang: item.lang, domain: item.domain});
        let listLanguages = infoCandidate.languages.map(getLang);
        let listLang = infoCandidate.languages?.length > 0 ? listLanguages : [];
        let cv_name_read = infoCandidate.cv ? infoCandidate.cv.split('/').at(-1) : '';
        setListLangDomain(listLang)
        formCandidate.setFieldsValue({...infoCandidate, cv_name_read});
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
            if(msgEmail) message.error('Este correo ya existe');
            else message.error('Candidato no actualizado');
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
            if(msgEmail) message.error('Este correo ya existe');
            else message.error('Candidato no registrado');
        }
    }

    const createData = (obj) =>{
        let dataCandidate = new FormData();
        dataCandidate.append('node', currentNode.id);
        let noValid = [undefined, null, '', ' '];
        Object.entries(obj).map(([key, val])=>{if(!noValid.includes(val)) dataCandidate.append(key, val)});
        if(fileCV.length > 0) dataCandidate.append('cv', fileCV[0]);
        if(listLangDomain.length > 0) dataCandidate.append('languages', JSON.stringify(listLangDomain));
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

    const actionCreate = () =>{
        formCandidate.resetFields();
        setFetching(false);
        setLoading({});
        setFileCV([]);
        setCurrentValue([])
        setListLangDomain([])
        setRuleLanguages(rule_languages)
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

    const setFileSelected = ({target : { files }}) =>{
        if(Object.keys(files).length <= 0) return false;
        formCandidate.setFieldsValue({cv_name_read: files[0].name});
        setFileCV([files[0]]);
    }

    const openFile = () =>{
        inputFile.current.value = null;
        inputFile.current.click();
    }

    const resetCV = () =>{
        setFileCV([]);
        formCandidate.setFieldsValue({cv_name_read: null});
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
                        initialValues={{is_active: true}}
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
                                    name='cv_name_read'
                                    rules={[ruleRequired]}
                                >
                                    <Input.Group compact>
                                        <Input
                                            readOnly
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
                                <ListLangs
                                    listLangDomain={listLangDomain}
                                    setListLangDomain={setListLangDomain}
                                    setCurrentValue={setCurrentValue}
                                    currentValue={currentValue}
                                    setRuleLanguages={setRuleLanguages}
                                    ruleLanguages={ruleLanguages}
                                    rule_languages={rule_languages}
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
        currentNode: state.userStore.current_node
    }
}


export default connect(mapState)(TabGeneral);