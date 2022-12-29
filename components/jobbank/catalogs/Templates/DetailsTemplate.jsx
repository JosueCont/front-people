import React, {
    useEffect,
    useState,
    useRef,
    useLayoutEffect
} from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Tabs,
    Form,
    Spin,
    message
} from 'antd';
import { connect } from 'react-redux';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import FormTemplate from './FormTemplate';
import { useProcessInfo } from '../../profiles/hook/useProcessInfo';
import WebApiJobBank from '../../../../api/WebApiJobBank';

const DetailsTemplate = ({
    action,
    currentNode,
    newFilters = {}
}) => {
    
    const fetchingItem = { loading: false, disabled: true };
    const fetchingParams = {
        back: fetchingItem,
        create: fetchingItem,
        edit: fetchingItem
    };
    const router = useRouter();
    const btnSave = useRef(null);
    const [formTemplate] = Form.useForm();
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');
    const [infoTemplate, setInfoTemplate] = useState({});
    const [fetching, setFetching] = useState(false);
    const { createData, formatData } = useProcessInfo();

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoTemplate(router.query.id);
        }
    },[router.query?.id])

    useEffect(()=>{
        if(Object.keys(infoTemplate).length > 0 && action == 'edit'){
            formTemplate.resetFields();
            let valuesCheks = formatData(infoTemplate.config);
            formTemplate.setFieldsValue({
                ...valuesCheks,
                name: infoTemplate.name,
                form_enable: infoTemplate.form_enable
            })
        }
    },[infoTemplate])

    const getInfoTemplate = async (id) =>{
        try {
            setFetching(true)
            let response = await WebApiJobBank.getInfoProfileType(id);
            setInfoTemplate(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            let body = {...values, node: currentNode.id};
            let response = await WebApiJobBank.createProfileType(body);
            actionSaveAnd(response.data.id);
            message.success('Tipo de template registrado');
        } catch (e) {
            console.log(e)
            setFetching(false)
            setLoading({})
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Tipo de template no registrado';
            message.error(msg);
        }
    }

    const onFinisUpdate = async (values) =>{
        try {
            let body = {...values, node: currentNode.id};
            await WebApiJobBank.updateProfileType(infoTemplate.id, body);
            getInfoTemplate(router.query.id);
            message.success('Tipo de template actualizado');
        } catch (e) {
            console.log(e)
            setFetching(false);
            let error = e.response?.data?.name?.at(-1);
            let msg = error ? 'Este nombre ya existe' : 'Tipo de template no actualizado';
            message.error(msg);
        }
    }

    const onFinish = (values) => {
        setFetching(true);
        const bodyData = createData(values, 'config');
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](bodyData);
    }

    const actionCreate = () =>{
        formTemplate.resetFields();
        setFetching(false)
        setLoading({})
    }

    const actionBack = () =>{
        router.push({
            pathname: '/jobbank/settings/catalogs/profiles',
            query: newFilters
        })
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/settings/catalogs/profiles/edit',
                query: {...newFilters, id }
            })
        }
        actionFunction[actionType]();
    }

    const getSaveAnd = (type) =>{
        setActionType(type)
        const item = { loading: true, disabled: false };
        setLoading({...fetchingParams, [type]: item });
        btnSave.current.click();
    }

    return (
        <Card>
            <Row gutter={[16,16]}>
                <Col span={24} className='title-action-content'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar nuevo tipo de template'
                            : 'Información del tipo de template'
                        }
                    </p>
                    <Button
                        onClick={()=> actionBack()}
                        icon={<ArrowLeftOutlined />}
                    >
                        Regresar
                    </Button>
                </Col>
                <Col span={24}>
                    <Spin spinning={fetching}>
                        <Form
                            form={formTemplate}
                            id='form-template'
                            layout='vertical'
                            onFinish={onFinish}
                            onFinishFailed={()=> setLoading({})}
                        >
                            <FormTemplate/>   
                        </Form>
                    </Spin>
                </Col>
                <Col span={24} className='tab-vacancies-btns'>
                    {action == 'add' ? (
                        <>
                            <button
                                htmlType='submit'
                                form='form-template'
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
                            form='form-template'
                            htmlType='submit'
                            loading={fetching}
                        >
                            Actualizar
                        </Button>
                    )}
                </Col>
            </Row>
        </Card>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(mapState)(DetailsTemplate);