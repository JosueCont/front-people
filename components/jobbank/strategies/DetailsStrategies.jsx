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
import WebApiJobBank from '../../../api/WebApiJobBank';
import FormStrategies from './FormStrategies';
import { useInfoStrategy } from '../hook/useInfoStrategy';

const DetailsStrategies = ({
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
    const btnSave = useRef(null);
    const router = useRouter();
    const [formStrategies] = Form.useForm();
    const [loading, setLoading] = useState({});
    const [actionType, setActionType] = useState('');
    const [infoStrategy, setInfoStrategy] = useState({});
    const [fetching, setFetching] = useState(false);
    const [optionVacant, setOptionVacant] = useState([]);
    const { createData, setValuesForm } = useInfoStrategy({setOptionVacant});

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoStrategy(router.query.id);
        }
    },[router.query?.id])

    useEffect(()=>{
        if(router.query.client && action == 'add'){
            formStrategies.resetFields()
            keepClient()
        }
    },[router.query])

    useEffect(()=>{
        if(Object.keys(infoStrategy).length > 0 && action == 'edit'){
            formStrategies.resetFields();
            let allValues = setValuesForm(infoStrategy);
            formStrategies.setFieldsValue(allValues);
        }
    },[infoStrategy])


    const getInfoStrategy = async (id) =>{
        try {
            setFetching(true)
            let response = await WebApiJobBank.getInfoStrategy(id);
            setInfoStrategy(response.data)
            setFetching(false)
        } catch (e) {
            console.log(e)
            setFetching(false)
        }
    }

    const keepClient = () =>{
        formStrategies.setFieldsValue({
            customer: router.query.client
        })
    }

    const onFinishUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateStrategy(infoStrategy.id, values);
            message.success('Estrategia actualizada');
            getInfoStrategy(infoStrategy.id);
        } catch (e) {
            console.log(e)
            let txtError = e.response?.data?.message;
            let msgError = txtError ?? 'Estrategia no actualizada';
            message.error(msgError);
            setFetching(false);
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            let response = await WebApiJobBank.createStrategy({...values, node: currentNode.id});
            message.success('Estrategia registrada');
            actionSaveAnd(response.data.id)
        } catch (e) {
            console.log(e)
            let txtError = e.response?.data?.message;
            let msgError = txtError ?? 'Estrategia no registrada';
            message.error(msgError);
            setFetching(false)
            setLoading({})
        }
    }

    const onFinish = (values) =>{
        setFetching(true)
        const bodyData = createData(values);
        const actionFunction = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actionFunction[action](bodyData);
    }

    const actionBack = () =>{
        if(router.query?.client) router.push({
            pathname: '/jobbank/clients',
            query: newFilters
        });
        else router.push({
            pathname: '/jobbank/strategies',
            query: newFilters
        });
    }

    const actionCreate = () =>{
        formStrategies.resetFields();
        if (router.query?.client) keepClient();
        setFetching(false)
        setLoading({})
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: actionBack,
            create: actionCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/strategies/edit',
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
                <Col span={24} className='title-action-content title-action-border'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar nueva estrategia'
                            : 'Información de la estrategia'
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
                            id='form-strategies'
                            form={formStrategies}
                            layout='vertical'
                            onFinish={onFinish}
                            // requiredMark={false}
                            onFinishFailed={()=> setLoading({})}
                        >
                            <FormStrategies
                                optionVacant={optionVacant}
                                formStrategies={formStrategies}
                                disabledClient={router.query?.client}
                            />
                        </Form>
                    </Spin>
                </Col>
                <Col span={24} className='tab-vacancies-btns'>
                    {action == 'add' ? (
                        <>
                            <button
                                htmlType='submit'
                                form='form-strategies'
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
                                Guardar y registrar otra
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
                            form='form-strategies'
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
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(DetailsStrategies);