import React, { useEffect, useState } from 'react';
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
    load_strategies,
    info_strategy,
    setLoadStrategies,
    getInfoStrategy
}) => {

    const router = useRouter();
    const [formStrategies] = Form.useForm();
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
            let response = await WebApiJobBank.createStrategy(values);
            message.success('Estrategia registrada');
            router.replace({
                pathname: '/jobbank/strategies/edit',
                query: { id: response.data.id }
            })
        } catch (e) {
            console.log(e)
            setLoadStrategies(false)
            message.error('Estrategia no registrada');
        }
    }

    const onFinish = (values) =>{
        setLoadStrategies(true)
        const bodyForm = createData(values);
        console.log('los valores-------->', bodyForm)
        const actionFunction = {
            edit: onFinishUpdate,
            add: onFinishCreate
        }
        actionFunction[action](values);
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
                        >
                            <FormStrategies/>
                        </Form>
                    </Spin>
                </Col>
                <Col span={24} className='tab-vacancies-btns'>
                    {/* <Button>
                        Cancelar
                    </Button> */}
                    <Button
                        form='form-strategies'
                        htmlType='submit'
                        loading={load_strategies}
                    >
                        Guardar
                    </Button>
                </Col>
            </Row>
        </Card>
    )
}

const mapState = (state) =>{
    return{
        load_strategies: state.jobBankStore.load_strategies,
        info_strategy: state.jobBankStore.info_strategy
    }
}

export default connect(
    mapState, {
        setLoadStrategies,
        getInfoStrategy
    }
)(DetailsStrategies);