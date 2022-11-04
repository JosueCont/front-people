import React, { useEffect, useState, useRef } from 'react';
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
import { useProcessInfo } from './hook/useProcessInfo';
import { setLoadStrategies, getInfoStrategy } from '../../../redux/jobBankDuck';

const DetailsStrategies = ({
    action,
    currentNode,
    load_strategies,
    info_strategy,
    setLoadStrategies,
    getInfoStrategy
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
    const { createData, setValuesForm } = useProcessInfo({
        info_strategy,
        formStrategies
    });

    useEffect(()=>{
        if(Object.keys(info_strategy).length > 0 && action == 'edit'){
            setValuesForm()
        }
    },[info_strategy])

    const onFinishUpdate = async (values) =>{
        try {
            await WebApiJobBank.updateStrategy(info_strategy.id, values);
            message.success('Estrategia actualizada');
            getInfoStrategy(info_strategy.id);
        } catch (e) {
            console.log(e)
            message.error('Estrategia no actualizada');
            setLoadStrategies(false);
        }
    }

    const onFinishCreate = async (values) =>{
        try {
            let response = await WebApiJobBank.createStrategy({...values, node: currentNode.id});
            message.success('Estrategia registrada');
            actionSaveAnd(response.data.id)
            formStrategies.resetFields();
        } catch (e) {
            console.log(e)
            setLoadStrategies(false)
            setLoading({})
            message.error('Estrategia no registrada');
        }
    }

    const onFinish = (values) =>{
        setLoadStrategies(true)
        const bodyData = createData(values);
        const actionFunction = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actionFunction[action](bodyData);
    }

    const actionAddCreate = () =>{
        setLoadStrategies(false)
        setLoading({})
    }

    const actionSaveAnd = (id) =>{
        const actionFunction = {
            back: () => router.push('/jobbank/strategies'),
            create: actionAddCreate,
            edit: ()=> router.replace({
                pathname: '/jobbank/strategies/edit',
                query: { id }
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
                        onClick={()=> router.push('/jobbank/strategies')}
                        icon={<ArrowLeftOutlined />}
                    >
                        Regresar
                    </Button>
                </Col>
                <Col span={24}>
                    <Spin spinning={load_strategies}>
                        <Form
                            id='form-strategies'
                            form={formStrategies}
                            layout='vertical'
                            onFinish={onFinish}
                            requiredMark={false}
                            onFinishFailed={()=> setLoading({})}
                        >
                            <FormStrategies formStrategies={formStrategies}/>
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
                            loading={load_strategies}
                        >
                            Guardar
                        </Button>
                    )}
                </Col>
            </Row>
        </Card>
    )
}

const mapState = (state) =>{
    return{
        load_strategies: state.jobBankStore.load_strategies,
        info_strategy: state.jobBankStore.info_strategy,
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
        setLoadStrategies,
        getInfoStrategy
    }
)(DetailsStrategies);