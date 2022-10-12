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
import TabFeatures from './TabFeatures';
import TabEducation from './TabEducation';
import TabSalary  from './TabSalary';
import TabRecruitment from './TabRecruitment';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { setLoadJobBank } from '../../../redux/jobBankDuck';

const DetailsVacancies = ({
    action,
    load_jobbank,
    setLoadJobBank
}) => {

    const router = useRouter();
    const [formJobBank] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinisUpdate = async () =>{
        console.log('los valores update------->', values)
    }

    const onFinishCreate = async (values) =>{
        console.log('los valores create------->', values)
        // setLoading(true);
        // setLoadJobBank(true);
        try {
            let formatDate = values.assignment_date?.format('YYYY-MM-DD');
            if(values.assignment_date) values.assignment_date = formatDate;
            // let response = await WebApiJobBank.createVacant(values);
            // console.log('response create------->', response);
            message.success('Vancante registrada');
            // setLoading(false);
            // router.replace({
            //     pathname: '/jobbank/vacancies/edit',
            //     query: {id: 1}
            // })
        } catch (e) {
            console.log('el error----->', e)
            message.error('Vacante no registrada')
            // setLoading(false);
            // setLoadJobBank(false);
        }
    }

    const onFinish = (values) => {
        const actionFunction = {
            edit: onFinisUpdate,
            add: onFinishCreate
        };
        actionFunction[action](values);
    }

    const onFailure = (error) =>{
        console.log('el error-------->', error)
    }

    const onValuesChange = (values) =>{
        console.log('value', values)
        // if(values?.rotative_turn) setTurnsIsDisabled(true);
        // if(!values?.rotative_turn) setTurnsIsDisabled(false);
    }

    return (
        <Card>
            <Row gutter={[16,16]}>
                <Col span={24} className='title-action-content'>
                    <p className='title-action-text'>
                        {action == 'add'
                            ? 'Registrar nueva vacante'
                            : 'Información de la vacante'
                        }
                    </p>
                    <Button
                        onClick={()=> router.push('/jobbank/vacancies')}
                        icon={<ArrowLeftOutlined />}
                    >
                        Regresar
                    </Button>
                </Col>
                <Col span={24}>
                    <Form
                        className='tabs-vacancies'
                        id='form-job-bank'
                        layout='vertical'
                        form={formJobBank}
                        onFinish={onFinish}
                        onFinishFailed={onFailure}
                        requiredMark={false}
                        // onValuesChange={onValuesChange}
                    >
                        <Tabs type='card'>
                            <Tabs.TabPane
                                tab={'Características del puesto'}
                                key={'tab_1'}
                            >
                                <Spin spinning={load_jobbank}>
                                    <TabFeatures/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={'Educación, competencias y habilidades'}
                                forceRender
                                key={'tab_2'}
                            >
                                <Spin spinning={load_jobbank}>
                                    <TabEducation/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={'Sueldo de prestaciones'}
                                forceRender
                                key={'tab_3'}
                            >
                                <Spin spinning={load_jobbank}>
                                    <TabSalary/>
                                </Spin>
                            </Tabs.TabPane>
                            <Tabs.TabPane
                                tab={'Proceso de reclutamiento'}
                                forceRender
                                key={'tab_4'}
                            >
                                <Spin spinning={load_jobbank}>
                                    <TabRecruitment/>
                                </Spin>
                            </Tabs.TabPane>
                        </Tabs>
                    </Form>
                </Col>
                <Col span={24} className='tab-vacancies-btns'>
                    <Button>
                        Cancelar
                    </Button>
                    <Button
                        form='form-job-bank'
                        htmlType='submit'
                        loading={loading}
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
        load_jobbank: state.jobBankStore.load_jobbank
    }
}

export default connect(
    mapState, {
        setLoadJobBank
    }
)(DetailsVacancies);